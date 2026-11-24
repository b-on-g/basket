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
	}) {}

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

	export function $bog_basket_lack( drive: $bog_basket_drive, point: $bog_basket_point ) {
		const portion = ( good: $bog_basket_good )=> $bog_basket_got( point, good ) / $bog_basket_need( point, good )
		return $bog_basket_goods( drive )
			.filter( good => $bog_basket_got( point, good ) < $bog_basket_need( point, good ) )
			.sort( ( left, right )=> portion( left ) - portion( right ) )
	}

	export function $bog_basket_drive_make( $: $, title: string ) {
		const land = $.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_deny ]])
		const drive = land.Data( $bog_basket_drive )
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

	export function $bog_basket_admit( drive: $bog_basket_drive, pass: $giper_baza_auth_pass, name: string ) {
		drive.land().give( pass, $giper_baza_rank_post( 'just' ) )
		drive.Volunteers( 'auto' )!.key( pass.lord().str, 'auto' ).val( name )
	}

	export function $bog_basket_dismiss( drive: $bog_basket_drive, lord: $giper_baza_link ) {
		for( const point of $bog_basket_points_all( drive ) ) {
			for( const shift of $bog_basket_shifts( point ) ) {
				if( shift.Volunteer()?.val() !== lord.str ) continue
				if( shift.Source()?.val() ) continue
				const copy = $bog_basket_shift_make( point, lord.str, shift.Started()!.val()! )
				copy.Source( 'auto' )!.val( shift.head().str )
				copy.Finished( 'auto' )!.val( shift.Finished()?.val() ?? null )
				for( const good of $bog_basket_goods( drive ) ) {
					const count = $bog_basket_count( shift, good )
					if( count ) copy.Counts( 'auto' )!.key( good.head().str, 'auto' ).val( count )
				}
			}
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
