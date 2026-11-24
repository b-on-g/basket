namespace $.$$ {

	export class $bog_basket_counter extends $.$bog_basket_counter {

		good( id: string ) {
			return this.drive().land().Pawn( $bog_basket_good ).Head( new $giper_baza_link( id ) )
		}

		good_ids() {
			return $bog_basket_goods( this.drive() ).map( good => good.head().str )
		}

		point_title() {
			return this.point().Title()?.val() ?? ''
		}

		tiles() {
			return this.good_ids().map( id => this.Tile( id ) )
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

		good_mine( id: string, next?: number ) {
			if( next !== undefined ) this.shift().Counts( 'auto' )!.key( id, 'auto' ).val( next )
			return $bog_basket_count( this.shift(), this.good( id ) )
		}

		ask_text() {
			const lack = $bog_basket_lack( this.drive(), this.point() ).slice( 0, 3 )
			if( !lack.length ) return 'План точки собран, спасибо!'
			return 'Сейчас нужнее всего: ' + lack.map( good => good.Title()?.val()?.toLowerCase() ).join( ', ' )
		}

		summary_text() {
			const mine = this.good_ids().reduce( ( sum, id )=> sum + this.good_mine( id ), 0 )
			const kits = $bog_basket_kits( this.drive(), this.point() )
			return `Наборов ${ kits } из ${ this.point().Kits()?.val() ?? 0 }, за смену принято ${ mine }`
		}

	}

}
