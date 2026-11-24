namespace $.$$ {

	export class $bog_basket_bar extends $.$bog_basket_bar {

		total_text() {
			return this.need() ? `${ this.got() } из ${ this.need() }` : String( this.got() )
		}

		progress() {
			return this.need() ? Math.min( 1, this.got() / this.need() ) : 0
		}

	}

}
