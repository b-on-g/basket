namespace $.$$ {

	export class $bog_basket_spot extends $.$bog_basket_spot {

		good( id: string ) {
			return this.drive().land().Pawn( $bog_basket_good ).Head( new $giper_baza_link( id ) )
		}

		shift( id: string ) {
			return this.drive().land().Pawn( $bog_basket_shift ).Head( new $giper_baza_link( id ) )
		}

		blocks() {
			return [
				this.Form(),
				this.Goods(),
				... this.shift_rows().length ? [ this.Shifts() ] : [],
				... this.buyer_link() ? [ this.Buyer() ] : [],
				... this.droppable() ? [ this.Drop() ] : [],
			]
		}

		point_title_text() {
			return this.point_title() || 'Без названия'
		}

		point_title( next?: string ) {
			return this.point().Title( next === undefined ? undefined : 'auto' )?.val( next ) ?? ''
		}

		point_address( next?: string ) {
			return this.point().Address( next === undefined ? undefined : 'auto' )?.val( next ) ?? ''
		}

		point_kits( next?: number ) {
			return this.point().Kits( next === undefined ? undefined : 'auto' )?.val( next === undefined ? undefined : next || 0 ) ?? 0
		}

		good_rows() {
			return $bog_basket_goods( this.drive() ).map( good => this.Good( good.head().str ) )
		}

		good_title( id: string ) {
			return this.good( id ).Title()?.val() ?? ''
		}

		good_got( id: string ) {
			return $bog_basket_got( this.point(), this.good( id ) )
		}

		good_need( id: string ) {
			return $bog_basket_need( this.point(), this.good( id ) )
		}

		shift_rows() {
			return $bog_basket_shifts( this.point() ).map( shift => this.Shift( shift.head().str ) )
		}

		shift_text( id: string ) {
			const shift = this.shift( id )
			const name = this.drive().Volunteers()?.key( shift.Volunteer()?.val() ?? '' )?.val() || 'Координатор'
			const count = $bog_basket_goods( this.drive() ).reduce( ( sum, good )=> sum + $bog_basket_count( shift, good ), 0 )
			const from = shift.Started()?.val()?.toString( 'DD.MM hh:mm' ) ?? ''
			const to = shift.Finished()?.val()?.toString( 'hh:mm' ) ?? 'идёт'
			return `${ name }: ${ count } шт., ${ from } – ${ to }`
		}

		droppable() {
			return !$bog_basket_shifts( this.point() ).length
		}

		@ $mol_action
		drop() {
			if( !this.droppable() ) return
			this.drive().Points( 'auto' )!.cut( this.point().link() )
			this.drop_done( null )
		}

	}

}
