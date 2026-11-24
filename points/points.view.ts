namespace $.$$ {

	export class $bog_basket_points extends $.$bog_basket_points {

		point( id: string ) {
			return this.drive().land().Pawn( $bog_basket_point ).Head( new $giper_baza_link( id ) )
		}

		drive_title() {
			return this.drive().Title()?.val() ?? ''
		}

		hint_text() {
			return this.rows().length
				? 'Выберите точку, где вы сегодня стоите.'
				: 'Координатор ещё не добавил точки.'
		}

		rows() {
			return $bog_basket_points_all( this.drive() ).map( point => this.Row( point.head().str ) )
		}

		point_title( id: string ) {
			return this.point( id ).Title()?.val() ?? ''
		}

		point_address( id: string ) {
			return this.point( id ).Address()?.val() ?? ''
		}

		point_kits( id: string ) {
			const point = this.point( id )
			return `Наборов ${ $bog_basket_kits( this.drive(), point ) } из ${ point.Kits()?.val() ?? 0 }`
		}

	}

}
