namespace $.$$ {

	export class $bog_basket_buyer extends $.$bog_basket_buyer {

		shop_title() {
			return this.shop().Title()?.val() || 'Что купить'
		}

		point_ids() {
			return ( this.shop().Points()?.keys() ?? [] ).map( String )
		}

		@ $mol_mem_key
		point( id: string ) {
			const text = this.shop().Points()?.key( id )?.val()
			return text ? JSON.parse( text ) as $bog_basket_shop_point : null
		}

		point_current() {
			const ids = this.point_ids()
			const id = this.point_id() || ( ids.length === 1 ? ids[0] : '' )
			return id ? this.point( id ) : null
		}

		blocks() {
			if( !this.point_current() ) return [ this.Intro(), this.Points() ]
			return [ this.Intro(), this.Money(), this.Goods(), this.Note(), this.Refuse() ]
		}

		intro_text() {
			const point = this.point_current()
			if( !point ) return this.point_ids().length ? 'Выберите точку, где вы сейчас.' : 'Здесь пока нет точек сбора.'
			return [ point.title, point.address ].filter( Boolean ).join( ', ' ) + '. Вот что сейчас нужнее всего:'
		}

		point_rows() {
			return this.point_ids().map( id => this.Point( id ) )
		}

		point_title( id: string ) {
			return this.point( id )?.title ?? ''
		}

		point_address( id: string ) {
			return this.point( id )?.address ?? ''
		}

		@ $mol_action
		point_open( id: string ) {
			this.point_id( id )
		}

		@ $mol_mem
		counts() {
			return $bog_basket_buy( this.point_current()?.goods ?? [], this.money() || 0 )
		}

		priced() {
			return this.point_current()?.goods.some( good => good.price > 0 ) ?? false
		}

		@ $mol_mem
		good_rows() {
			const goods = this.point_current()?.goods ?? []
			return goods
				.map( ( good, index )=> ({ good, index }) )
				.filter( ({ good, index })=> this.priced() ? this.counts()[ index ] : good.got < good.need )
				.map( ({ index })=> this.Good( index ) )
		}

		good_title( index: number ) {
			return this.point_current()?.goods[ index ]?.title ?? ''
		}

		good_count( index: number ) {
			const good = this.point_current()?.goods[ index ]
			if( !good ) return ''
			if( !this.priced() ) return `ещё ${ good.need - good.got } шт.`
			const count = this.counts()[ index ]
			return `${ count } шт., ${ count * good.price } ₽`
		}

		note_text() {
			const goods = this.point_current()?.goods ?? []
			if( goods.every( good => good.got >= good.need ) ) return 'План точки собран, спасибо!'
			if( !this.priced() ) return ''
			const sum = this.counts().reduce( ( sum, count, index )=> sum + count * goods[ index ].price, 0 )
			if( !sum ) return 'На эту сумму ничего из нужного не купить.'
			return `Итого около ${ sum } ₽. Цены ориентировочные, на полке могут отличаться.`
		}

	}

}
