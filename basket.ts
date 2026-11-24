namespace $ {

	export class $bog_basket_good extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Weight: $giper_baza_atom_real,
		Kit: $giper_baza_atom_real,
		Price: $giper_baza_atom_real,
	}) {}

	export class $bog_basket_shift extends $giper_baza_dict.with({
		Volunteer: $giper_baza_atom_text,
		Started: $giper_baza_atom_time,
		Finished: $giper_baza_atom_time,
		Counts: $giper_baza_dict_to( $giper_baza_atom_real ),
		Source: $giper_baza_atom_text,
	}) {}

	export class $bog_basket_point extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Address: $giper_baza_atom_text,
		Kits: $giper_baza_atom_real,
		Shifts: $giper_baza_list_link.to( ()=> $bog_basket_shift ),
	}) {}

	export class $bog_basket_drive extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Goods: $giper_baza_list_link.to( ()=> $bog_basket_good ),
		Points: $giper_baza_list_link.to( ()=> $bog_basket_point ),
		Volunteers: $giper_baza_dict_to( $giper_baza_atom_text ),
		Shop: $giper_baza_atom_text,
	}) {}

	export class $bog_basket_shop extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Updated: $giper_baza_atom_time,
		Points: $giper_baza_dict_to( $giper_baza_atom_text ),
	}) {}

	export type $bog_basket_shop_point = {
		title: string
		address: string
		goods: { title: string, price: number, got: number, need: number }[]
	}

	export class $bog_basket_home extends $giper_baza_dict.with({
		Drives: $giper_baza_list_link.to( ()=> $bog_basket_drive ),
	}, 'bog_basket' ) {}

	export function $bog_basket_goods( drive: $bog_basket_drive ) {
		return drive.Goods()?.remote_list() ?? []
	}

	export function $bog_basket_points_all( drive: $bog_basket_drive ) {
		return drive.Points()?.remote_list() ?? []
	}

	export function $bog_basket_shifts( point: $bog_basket_point ) {
		const shifts = point.Shifts()?.remote_list() ?? []
		const replaced = new Set( shifts.map( shift => shift.Source()?.val() ).filter( Boolean ) )
		return shifts.filter( shift => !replaced.has( shift.head().str ) )
	}

	export function $bog_basket_count( shift: $bog_basket_shift, good: $bog_basket_good ) {
		return shift.Counts()?.key( good.head().str )?.val() ?? 0
	}

	export function $bog_basket_got( point: $bog_basket_point, good: $bog_basket_good ) {
		return $bog_basket_shifts( point ).reduce( ( sum, shift )=> sum + $bog_basket_count( shift, good ), 0 )
	}

	export function $bog_basket_need( point: $bog_basket_point, good: $bog_basket_good ) {
		return ( point.Kits()?.val() ?? 0 ) * ( good.Kit()?.val() ?? 0 )
	}

	export function $bog_basket_kits( drive: $bog_basket_drive, point: $bog_basket_point ) {
		const kits = $bog_basket_goods( drive )
			.filter( good => good.Kit()?.val() )
			.map( good => Math.floor( $bog_basket_got( point, good ) / good.Kit()!.val()! ) )
		return kits.length ? Math.min( ... kits ) : 0
	}

	export function $bog_basket_tier( land: $giper_baza_land, lord: $giper_baza_link ) {
		land.sync()
		return land.lord_rank( lord )
	}

	export function $bog_basket_total( point: $bog_basket_point, goods: readonly $bog_basket_good[] ) {
		return goods.reduce( ( sum, good )=> sum + $bog_basket_got( point, good ), 0 )
	}

	export function $bog_basket_lack( drive: $bog_basket_drive, point: $bog_basket_point ) {
		const portion = ( good: $bog_basket_good )=> $bog_basket_got( point, good ) / $bog_basket_need( point, good )
		return $bog_basket_goods( drive )
			.filter( good => $bog_basket_got( point, good ) < $bog_basket_need( point, good ) )
			.sort( ( left, right )=> portion( left ) - portion( right ) )
	}

	export function $bog_basket_drive_make( $: $, title: string ) {
		const land = $.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_deny ]])
		const shop = $.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_read ]])
		const drive = land.Data( $bog_basket_drive )
		drive.Shop( 'auto' )!.val( shop.link().str )
		drive.Title( 'auto' )!.val( title )
		drive.Goods( 'auto' )
		drive.Points( 'auto' )
		drive.Volunteers( 'auto' )
		return drive
	}

	export function $bog_basket_good_make( drive: $bog_basket_drive, title: string, weight: number, kit: number, price: number ) {
		const good = drive.Goods( 'auto' )!.make( null )
		good.Title( 'auto' )!.val( title )
		good.Weight( 'auto' )!.val( weight )
		good.Kit( 'auto' )!.val( kit )
		good.Price( 'auto' )!.val( price )
		return good
	}

	export function $bog_basket_point_make( drive: $bog_basket_drive, title: string, address: string, kits: number ) {
		const point = drive.Points( 'auto' )!.make( null )
		point.Title( 'auto' )!.val( title )
		point.Address( 'auto' )!.val( address )
		point.Kits( 'auto' )!.val( kits )
		point.Shifts( 'auto' )
		return point
	}

	export function $bog_basket_shift_make( point: $bog_basket_point, volunteer: string, started: $mol_time_moment ) {
		const shift = point.Shifts( 'auto' )!.make( null )
		shift.Volunteer( 'auto' )!.val( volunteer )
		shift.Started( 'auto' )!.val( started )
		shift.Counts( 'auto' )
		return shift
	}

	export function $bog_basket_shift_open( drive: $bog_basket_drive, volunteer: string ) {
		return $bog_basket_points_all( drive )
			.flatMap( point => $bog_basket_shifts( point ) )
			.find( shift => shift.Volunteer()?.val() === volunteer && !shift.Finished()?.val() && !shift.Source()?.val() ) ?? null
	}

	export function $bog_basket_shop_publish( drive: $bog_basket_drive, updated: $mol_time_moment ) {
		const link = drive.Shop()?.val()
		if( !link ) return
		const shop = drive.$.$giper_baza_glob.Land( new $giper_baza_link( link ) ).Data( $bog_basket_shop )
		const title = drive.Title()?.val() ?? ''
		const goods = $bog_basket_goods( drive )
		const points = $bog_basket_points_all( drive )
		const texts = new Map( points.map( point => [ point.head().str, JSON.stringify({
			title: point.Title()?.val() ?? '',
			address: point.Address()?.val() ?? '',
			goods: goods.map( good => ({
				title: good.Title()?.val() ?? '',
				price: good.Price()?.val() ?? 0,
				got: $bog_basket_got( point, good ),
				need: $bog_basket_need( point, good ),
			}) ),
		} satisfies $bog_basket_shop_point ) ] ) )
		const extra = ( shop.Points()?.keys() ?? [] ).map( String ).filter( id => !texts.has( id ) )
		const fresh = [ ... texts ].filter( ([ id, text ])=> shop.Points()?.key( id )?.val() !== text )
		if( shop.Title()?.val() === title && !extra.length && !fresh.length ) return
		shop.Title( 'auto' )!.val( title )
		for( const id of extra ) shop.Points( 'auto' )!.has( id, false )
		for( const [ id, text ] of fresh ) shop.Points( 'auto' )!.key( id, 'auto' ).val( text )
		shop.Updated( 'auto' )!.val( updated )
	}

	export function $bog_basket_buy( goods: $bog_basket_shop_point[ 'goods' ], money: number ) {
		const counts = goods.map( ()=> 0 )
		for(;;) {
			const portion = ( index: number )=> ( goods[ index ].got + counts[ index ] ) / goods[ index ].need
			const next = goods.map( ( _, index )=> index )
				.filter( index => goods[ index ].price > 0 && goods[ index ].price <= money && portion( index ) < 1 )
				.sort( ( left, right )=> portion( left ) - portion( right ) )[0]
			if( next === undefined ) return counts
			++ counts[ next ]
			money -= goods[ next ].price
		}
	}

	export function $bog_basket_csv( drive: $bog_basket_drive ) {
		const goods = $bog_basket_goods( drive )
		const head = [ 'Точка', 'Адрес', 'Наборов план', 'Наборов готово', ... goods.flatMap( good => {
			const title = good.Title()?.val() ?? ''
			return [ `${ title }, принято`, `${ title }, план` ]
		} ) ]
		const rows = $bog_basket_points_all( drive ).map( point => [
			point.Title()?.val() ?? '',
			point.Address()?.val() ?? '',
			point.Kits()?.val() ?? 0,
			$bog_basket_kits( drive, point ),
			... goods.flatMap( good => [ $bog_basket_got( point, good ), $bog_basket_need( point, good ) ] ),
		].map( String ) )
		return $mol_csv_serial_table( [ head, ... rows ], ';' )
	}

	export function $bog_basket_admit( drive: $bog_basket_drive, pass: $giper_baza_auth_pass, name: string ) {
		const lord = pass.lord()
		if( !drive.Volunteers()?.key( lord.str )?.val() ) drive.Volunteers( 'auto' )!.key( lord.str, 'auto' ).val( name )
		if( $bog_basket_tier( drive.land(), lord ) < $giper_baza_rank_tier.post ) drive.land().give( pass, $giper_baza_rank_post( 'just' ) )
	}

	export function $bog_basket_dismiss( drive: $bog_basket_drive, lord: $giper_baza_link ) {
		const goods = $bog_basket_goods( drive )
		const copies = $bog_basket_points_all( drive ).flatMap( point => $bog_basket_shifts( point )
			.filter( shift => shift.Volunteer()?.val() === lord.str && !shift.Source()?.val() )
			.map( shift => ({
				point,
				source: shift.head().str,
				started: shift.Started()!.val()!,
				finished: shift.Finished()?.val() ?? null,
				counts: goods.map( good => [ good.head().str, $bog_basket_count( shift, good ) ] as const ).filter( ([ , count ])=> count ),
			}) )
		)
		for( const { point, source, started, finished, counts } of copies ) {
			const copy = $bog_basket_shift_make( point, lord.str, started )
			for( const [ good, count ] of counts ) copy.Counts( 'auto' )!.key( good, 'auto' ).val( count )
			copy.Finished( 'auto' )!.val( finished )
			copy.Source( 'auto' )!.val( source )
		}
		drive.land().lord_rank( lord, $giper_baza_rank_deny )
	}

	export const $bog_basket_example_goods = [
		{ title: 'Гречка', weight: .8, kit: 2, price: 90 },
		{ title: 'Рис', weight: .8, kit: 2, price: 110 },
		{ title: 'Макароны', weight: .45, kit: 2, price: 70 },
		{ title: 'Сахар', weight: 1, kit: 1, price: 80 },
		{ title: 'Масло в пластике', weight: .9, kit: 1, price: 140 },
		{ title: 'Тушёнка в жести', weight: .33, kit: 3, price: 200 },
		{ title: 'Рыбные консервы', weight: .24, kit: 2, price: 130 },
		{ title: 'Чай', weight: .1, kit: 1, price: 120 },
	]

	export const $bog_basket_example_points = [
		{ title: 'Точка 1', address: 'Пример: универсам у метро', kits: 20, counts: [ 31, 24, 40, 11, 6, 22, 35, 18 ] },
		{ title: 'Точка 2', address: 'Пример: магазин во дворе', kits: 10, counts: [ 12, 9, 14, 10, 2, 17, 8, 5 ] },
		{ title: 'Точка 3', address: 'Пример: гипермаркет', kits: 40, counts: [] as number[] },
	]

}
