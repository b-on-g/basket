namespace $.$$ {

	export class $bog_basket_tile extends $.$bog_basket_tile {

		full() {
			return this.need() > 0 && this.got() >= this.need()
		}

		mine_text() {
			return this.mine() ? `+${ this.mine() }` : ''
		}

		drop_enabled() {
			return this.mine() > 0
		}

		drop_content() {
			return this.drop_enabled() ? [ this.Drop_icon() ] : []
		}

		@ $mol_action
		add() {
			this.mine( this.mine() + 1 )
		}

		@ $mol_action
		drop() {
			if( this.drop_enabled() ) this.mine( this.mine() - 1 )
		}

	}

}
