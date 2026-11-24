namespace $.$$ {

	const local = typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test( location.hostname )
	if( local ) $giper_baza_yard.masters = (): string[] => $giper_baza_yard.masters_override() ?? [ 'http://localhost:9090/' ]

	export class $bog_basket_app extends $.$bog_basket_app {

		home() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_basket_home )
		}

		lord() {
			return this.$.$giper_baza_auth.current().pass().lord()
		}

		arg( key: string, next?: string ) {
			if( next !== undefined ) this.$.$mol_state_arg.go({ [ key ]: next || null })
			return this.$.$mol_state_arg.value( key ) ?? ''
		}

		drive_id() {
			const id = this.$.$mol_state_arg.value( 'drive' )
			if( id === null ) return this.home().Drives()?.items().at( -1 )?.str ?? ''
			return /^[\wæÆ]{8}_[\wæÆ]{8}$/.test( id ) ? id : ''
		}

		drive_open( id: string ) {
			this.$.$mol_state_arg.go({ drive: id, screen: null, point: null, admit: null })
		}

		screen( next?: string ) {
			return this.arg( 'screen', next )
		}

		spot_id( next?: string ) {
			return this.arg( 'point', next )
		}

		admit( next?: string ) {
			return this.arg( 'admit', next )
		}

		shop_id() {
			return this.$.$mol_state_arg.value( 'shop' ) ?? ''
		}

		shop() {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( this.shop_id() ) ).Data( $bog_basket_shop )
		}

		drive() {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( this.drive_id() ) ).Data( $bog_basket_drive )
		}

		auto() {
			this.home()
			if( !this.shop_id() ) this.drive_remember()
		}

		drive_remember() {
			const id = this.drive_id()
			if( !id ) return
			const link = new $giper_baza_link( id )
			if( this.home().Drives()?.has( link ) ) return
			const drives = this.home().Drives( 'auto' )!
			drives.items([ ... drives.items(), link ])
		}

		tier() {
			return $bog_basket_tier( this.drive().land(), this.lord() )
		}

		admitted() {
			return this.tier() >= $giper_baza_rank_tier.post
		}

		chief() {
			return this.tier() >= $giper_baza_rank_tier.rule
		}

		invite_link() {
			return this.$.$mol_state_arg.make_link({ drive: this.drive_id() })
		}

		buyer_link( point: string ) {
			const shop = this.drive().Shop()?.val()
			return shop ? this.$.$mol_state_arg.make_link({ shop, point }) : ''
		}

		spot_point( id: string ) {
			return this.drive().land().Pawn( $bog_basket_point ).Head( new $giper_baza_link( id ) )
		}

		@ $mol_action
		spot_close() {
			this.drive_open( this.drive_id() )
		}

		drive_ids() {
			return ( this.home().Drives()?.items() ?? [] ).map( link => link.str )
		}

		drive_rows() {
			return this.drive_ids().map( id => this.Drive( id ) ).reverse()
		}

		drive_arg( id: string ) {
			return { drive: id, screen: null, point: null, admit: null }
		}

		drive_title( id: string ) {
			const land = this.$.$giper_baza_glob.Land( new $giper_baza_link( id ) )
			if( $bog_basket_tier( land, this.lord() ) < $giper_baza_rank_tier.read ) return 'Ждёт допуска'
			return land.Data( $bog_basket_drive ).Title()?.val() || 'Без названия'
		}

		welcome_blocks() {
			return [
				this.About(),
				... this.drive_ids().length ? [ this.Drives() ] : [],
				this.Create(),
				this.Join(),
				this.Try(),
			]
		}

		office_pages() {
			const side = this.admit() ? 'team' : this.screen()
			return [
				this.Office(),
				... side === 'team' ? [ this.Team() ] : [],
				... side === 'kit' ? [ this.Kit() ] : [],
				... side === 'spot' && this.spot_id() ? [ this.Spot( this.spot_id() ) ] : [],
			]
		}

		create_enabled() {
			return Boolean( this.create_title().trim() )
		}

		@ $mol_action
		create() {
			if( !this.create_enabled() ) return
			const drive = $bog_basket_drive_make( this.$, this.create_title().trim() )
			for( const good of $bog_basket_example_goods ) $bog_basket_good_make( drive, good.title, good.weight, good.kit, 0 )
			this.create_title( '' )
			this.drive_open( drive.land().link().str )
		}

		admission_link() {
			return this.$.$mol_state_arg.make_link({
				drive: this.drive_id(),
				admit: this.$.$giper_baza_auth.current().pass().toString(),
			})
		}

		shift_id( next?: string | null ) {
			return this.$.$mol_state_local.value( `bog_basket_shift:${ this.drive_id() }`, next ) ?? ''
		}

		shift( id: string ) {
			return this.drive().land().Pawn( $bog_basket_shift ).Head( new $giper_baza_link( id ) )
		}

		shift_point( id: string ) {
			return $bog_basket_points_all( this.drive() )
				.find( point => point.Shifts()?.items().some( link => link.head().str === id ) )!
		}

		pages() {
			if( this.shop_id() ) return [ this.Buyer() ]
			if( !this.drive_id() ) return [ this.Welcome() ]
			if( !this.admitted() ) return [ this.Admission() ]
			if( this.chief() && this.screen() !== 'count' ) return this.office_pages()
			const shift = this.shift_id()
			return [ shift && this.shift_point( shift ) ? this.Counter( shift ) : this.Points() ]
		}

		@ $mol_action
		shift_start( point: string ) {
			const spot = this.drive().land().Pawn( $bog_basket_point ).Head( new $giper_baza_link( point ) )
			const shift = $bog_basket_shift_make( spot, this.lord().str, new $mol_time_moment )
			this.shift_id( shift.head().str )
		}

		@ $mol_action
		shift_finish( id: string ) {
			this.shift( id ).Finished( 'auto' )!.val( new $mol_time_moment )
			this.shift_id( null )
		}

		@ $mol_action
		example_open() {
			const drive = $bog_basket_drive_make( this.$, 'Пример сбора' )
			const goods = $bog_basket_example_goods.map( good =>
				$bog_basket_good_make( drive, good.title, good.weight, good.kit, good.price )
			)
			for( const { title, address, kits, counts } of $bog_basket_example_points ) {
				const point = $bog_basket_point_make( drive, title, address, kits )
				if( !counts.length ) continue
				const shift = $bog_basket_shift_make( point, '', new $mol_time_moment )
				counts.forEach( ( count, index )=> shift.Counts( 'auto' )!.key( goods[ index ].head().str, 'auto' ).val( count ) )
			}
			this.drive_open( drive.land().link().str )
		}

	}

}
