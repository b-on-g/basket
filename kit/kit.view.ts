namespace $.$$ {

	export class $bog_basket_kit extends $.$bog_basket_kit {

		good( id: string ) {
			return this.drive().land().Pawn( $bog_basket_good ).Head( new $giper_baza_link( id ) )
		}

		rows() {
			return $bog_basket_goods( this.drive() ).map( good => this.Row( good.head().str ) )
		}

		row_head( id: string ) {
			return [
				this.Good_title( id ),
				... this.droppable( id ) ? [ this.Drop( id ) ] : [],
			]
		}

		droppable( id: string ) {
			return $bog_basket_points_all( this.drive() ).every( point => !$bog_basket_got( point, this.good( id ) ) )
		}

		good_title( id: string, next?: string ) {
			return this.good( id ).Title( next === undefined ? undefined : 'auto' )?.val( next ) ?? ''
		}

		good_kit( id: string, next?: number ) {
			return this.good( id ).Kit( next === undefined ? undefined : 'auto' )?.val( next === undefined ? undefined : next || 0 ) ?? 0
		}

		good_weight( id: string, next?: number ) {
			return this.good( id ).Weight( next === undefined ? undefined : 'auto' )?.val( next === undefined ? undefined : next || 0 ) ?? 0
		}

		good_price( id: string, next?: number ) {
			return this.good( id ).Price( next === undefined ? undefined : 'auto' )?.val( next === undefined ? undefined : next || 0 ) ?? 0
		}

		@ $mol_action
		add() {
			$bog_basket_good_make( this.drive(), '', 0, 1, 0 )
		}

		@ $mol_action
		drop( id: string ) {
			if( this.droppable( id ) ) this.drive().Goods( 'auto' )!.cut( this.good( id ).link() )
		}

	}

}
