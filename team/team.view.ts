namespace $.$$ {

	export class $bog_basket_team extends $.$bog_basket_team {

		pass() {
			const text = this.admit()
			if( !/^[\w-]{86}$/.test( text ) ) return null
			return $giper_baza_auth_pass.from( text )
		}

		paste( next?: string ) {
			const text = next?.match( /admit=([\w%-]+)/ )?.[1]
			if( text ) this.admit( decodeURIComponent( text ) )
			return ''
		}

		blocks() {
			return [
				... this.admit() ? [ this.Pending() ] : [],
				... this.lords().length ? [ this.People(), this.Warning() ] : [],
				this.Invite(),
				this.Paste(),
			]
		}

		admitted( lord: string ) {
			return $bog_basket_tier( this.drive().land(), new $giper_baza_link( lord ) ) >= $giper_baza_rank_tier.post
		}

		admit_enabled() {
			const pass = this.pass()
			return Boolean( pass && !this.admitted( pass.lord().str ) )
		}

		pending_text() {
			const pass = this.pass()
			if( !pass ) return 'Ссылка повреждена, попросите волонтёра прислать её ещё раз.'
			if( this.admitted( pass.lord().str ) ) return 'Этот волонтёр уже допущен.'
			return 'Волонтёр просит допуск.'
		}

		lords() {
			return ( this.drive().Volunteers()?.keys() ?? [] ).map( String )
		}

		people_rows() {
			return this.lords().map( lord => this.Person( lord ) )
		}

		person_name( lord: string, next?: string ) {
			return this.drive().Volunteers( next === undefined ? undefined : 'auto' )?.key( lord, next === undefined ? undefined : 'auto' )?.val( next ) ?? ''
		}

		person_status( lord: string ) {
			return this.admitted( lord ) ? 'допущен' : 'отозван'
		}

		person_sub( lord: string ) {
			return [
				this.Person_name( lord ),
				this.Person_status( lord ),
				this.admitted( lord ) ? this.Dismiss( lord ) : this.Restore( lord ),
			]
		}

		@ $mol_action
		dismiss( lord: string ) {
			$bog_basket_dismiss( this.drive(), new $giper_baza_link( lord ) )
		}

		@ $mol_action
		restore( lord: string ) {
			this.drive().land().lord_rank( new $giper_baza_link( lord ), $giper_baza_rank_post( 'just' ) )
		}

		@ $mol_action
		admit_run() {
			const pass = this.pass()
			if( !pass ) return
			$bog_basket_admit( this.drive(), pass, this.name().trim() || `Волонтёр ${ this.lords().length + 1 }` )
			this.name( '' )
			this.admit( '' )
		}

	}

}
