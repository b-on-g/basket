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

		drive_id( next?: string ) {
			const id = this.$.$mol_state_arg.value( 'drive', next )
			if( id && /^\w{8}_\w{8}$/.test( id ) ) return id
			return this.home().Drives()?.items().at( -1 )?.str ?? ''
		}

		drive() {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( this.drive_id() ) ).Data( $bog_basket_drive )
		}

		auto() {
			this.home()
			this.drive_remember()
		}

		drive_remember() {
			const id = this.drive_id()
			if( !id ) return
			const link = new $giper_baza_link( id )
			if( this.home().Drives()?.has( link ) ) return
			const drives = this.home().Drives( 'auto' )!
			drives.items([ ... drives.items(), link ])
		}

		admitted() {
			const land = this.drive().land()
			land.sync()
			return land.lord_rank( this.lord() ) >= $giper_baza_rank_tier.post
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
			if( !this.drive_id() ) return [ this.Welcome() ]
			if( !this.admitted() ) return [ this.Admission() ]
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
			this.drive_id( drive.land().link().str )
		}

	}

}
