namespace $.$$ {

	export class $bog_basket_office extends $.$bog_basket_office {

		good( id: string ) {
			return this.drive().land().Pawn( $bog_basket_good ).Head( new $giper_baza_link( id ) )
		}

		point( id: string ) {
			return this.drive().land().Pawn( $bog_basket_point ).Head( new $giper_baza_link( id ) )
		}

		points() {
			return $bog_basket_points_all( this.drive() )
		}

		auto() {
			$bog_basket_shop_publish( this.drive(), new $mol_time_moment )
		}

		drive_title() {
			return this.drive().Title()?.val() ?? ''
		}

		good_rows() {
			return $bog_basket_goods( this.drive() ).map( good => this.Good( good.head().str ) )
		}

		good_title( id: string ) {
			return this.good( id ).Title()?.val() ?? ''
		}

		@ $mol_mem_key
		good_got( id: string ) {
			return this.points().reduce( ( sum, point )=> sum + $bog_basket_got( point, this.good( id ) ), 0 )
		}

		@ $mol_mem_key
		good_need( id: string ) {
			return this.points().reduce( ( sum, point )=> sum + $bog_basket_need( point, this.good( id ) ), 0 )
		}

		point_rows() {
			return this.points().map( point => this.Point( point.head().str ) )
		}

		point_arg( id: string ) {
			return { screen: 'spot', point: id, admit: null }
		}

		point_title( id: string ) {
			return this.point( id ).Title()?.val() || 'Без названия'
		}

		@ $mol_mem_key
		point_kits( id: string ) {
			return $bog_basket_kits( this.drive(), this.point( id ) )
		}

		point_plan( id: string ) {
			return this.point( id ).Kits()?.val() ?? 0
		}

		@ $mol_mem_key
		point_note( id: string ) {
			const lack = $bog_basket_lack( this.drive(), this.point( id ) ).slice( 0, 2 )
			const open = $bog_basket_shifts( this.point( id ) ).filter( shift => !shift.Finished()?.val() ).length
			return [
				open ? `Смен идёт: ${ open }` : 'Сейчас никто не принимает',
				... lack.length ? [ 'не хватает: ' + lack.map( good => good.Title()?.val()?.toLowerCase() ).join( ', ' ) ] : [],
			].join( ', ' )
		}

		@ $mol_mem
		total_text() {
			const goods = $bog_basket_goods( this.drive() )
			const count = goods.reduce( ( sum, good )=> sum + this.good_got( good.head().str ), 0 )
			const weight = goods.reduce( ( sum, good )=> sum + this.good_got( good.head().str ) * ( good.Weight()?.val() ?? 0 ), 0 )
			const kits = this.points().reduce( ( sum, point )=> sum + this.point_kits( point.head().str ), 0 )
			const plan = this.points().reduce( ( sum, point )=> sum + this.point_plan( point.head().str ), 0 )
			return `Принято ${ count } шт., ${ Math.round( weight ) } кг. Наборов готово ${ kits } из ${ plan }.`
		}

		point_add_enabled() {
			return Boolean( this.point_new_title().trim() )
		}

		@ $mol_action
		point_add() {
			if( !this.point_add_enabled() ) return
			$bog_basket_point_make( this.drive(), this.point_new_title().trim(), '', 0 )
			this.point_new_title( '' )
		}

		@ $mol_mem
		csv_blob() {
			return new $mol_blob( [ '﻿' + $bog_basket_csv( this.drive() ) ], { type: 'text/csv' } )
		}

	}

}
