namespace $ {

	function app_make( $: $ ) {
		const app = $bog_basket_app.make({ $ }) as $$.$bog_basket_app
		app.drive_id( '' )
		new $mol_wire_atom( 'bog_basket_test_home', ()=> app.home() ).fresh()
		return app
	}

	async function app_example( $: $ ) {
		const app = app_make( $ )
		await $mol_wire_async( app ).example_open()
		new $mol_wire_atom( 'bog_basket_test_drive', ()=> app.drive().land() ).fresh()
		return app
	}

	async function wire( from: $giper_baza_land, to: $giper_baza_land ) {
		const net = {
			pack() {
				return $giper_baza_pack.make( from.diff_parts() ).asArray().slice()
			},
			apply( parts: $giper_baza_pack_parts ) {
				for( const [ , part ] of parts ) to.diff_apply( part.units )
			},
		}
		const bin = await $mol_wire_async( net ).pack()
		await $mol_wire_async( net ).apply( $giper_baza_pack.from( bin ).parts() )
	}

	function phone( $: $, land: $giper_baza_land, auth: $giper_baza_auth ) {
		const copy = $giper_baza_land.make({ $, link: ()=> land.link(), auth: ()=> auth })
		const good = ()=> copy.Pawn( $bog_basket_good ).Head( copy.Data( $bog_basket_drive ).Goods()!.items()[0].head() )
		const point = ()=> copy.Pawn( $bog_basket_point ).Head( copy.Data( $bog_basket_drive ).Points()!.items()[0].head() )
		const ops = {
			accept( count: number ) {
				const shift = $bog_basket_shift_make( point(), auth.pass().lord().str, new $mol_time_moment( '2026-11-28T10:00' ) )
				shift.Counts( 'auto' )!.key( good().head().str, 'auto' ).val( count )
			},
		}
		return { copy, ops: $mol_wire_async( ops ) }
	}

	function staff( app: $$.$bog_basket_app ) {
		const point = ()=> ( app.Points() as $$.$bog_basket_points ).point( app.drive().Points()!.items()[0].head().str )
		return $mol_wire_async({
			admit( pass: $giper_baza_auth_pass, name: string ) {
				$bog_basket_admit( app.drive(), pass, name )
			},
			dismiss( lord: $giper_baza_link ) {
				$bog_basket_dismiss( app.drive(), lord )
			},
			got() {
				return $bog_basket_got( point(), $bog_basket_goods( app.drive() )[0] )
			},
			shifts() {
				return $bog_basket_shifts( point() ).length
			},
		})
	}

	$mol_test({

		'newcomer sees the welcome page'( $ ) {
			const app = app_make( $ )
			$mol_assert_equal( app.pages(), [ app.Welcome() ] )
		},

		async 'example opens the list of points'( $ ) {
			const app = await app_example( $ )

			$mol_assert_equal( app.pages(), [ app.Points() ] )
			$mol_assert_equal( app.Points().rows().length, $bog_basket_example_points.length )
			$mol_assert_equal( ( app.Points() as $$.$bog_basket_points ).point_kits( app.drive().Points()!.items()[0].head().str ), 'Наборов 6 из 20' )
		},

		async 'volunteer takes a point, counts goods and finishes'( $ ) {
			const app = await app_example( $ )
			const point = app.drive().Points()!.items()[2].head().str

			app.Points().Row( point ).click()
			const counter = app.Counter( app.shift_id() ) as $$.$bog_basket_counter
			$mol_assert_equal( app.pages(), [ counter ] )
			$mol_assert_equal( counter.point_title(), 'Точка 3' )

			const tile = counter.tiles()[0] as $$.$bog_basket_tile
			$mol_assert_equal( tile.Drop().enabled(), false )
			tile.Add().click()
			tile.Add().click()
			tile.Add().click()
			tile.Drop().click()
			$mol_assert_equal( tile.mine_text(), '+2' )
			$mol_assert_equal( tile.total_text(), '2 из 80' )
			$mol_assert_equal( counter.summary_text(), 'Наборов 0 из 40, за смену принято 2' )

			counter.Finish().click()
			$mol_assert_equal( app.pages(), [ app.Points() ] )
		},

		async 'the most lacking goods are asked first'( $ ) {
			const app = await app_example( $ )
			app.shift_start( app.drive().Points()!.items()[0].head().str )
			const counter = app.Counter( app.shift_id() ) as $$.$bog_basket_counter
			$mol_assert_equal( counter.ask_text(), 'Сейчас нужнее всего: масло в пластике, тушёнка в жести, сахар' )
		},

		async 'stranger shows the code until admitted'( $ ) {
			const app = await app_example( $ )
			const land = app.drive().land()
			const auth = $.$giper_baza_auth.grab()
			const { copy } = phone( $, land, auth )
			const guest = $bog_basket_app.make({
				$,
				drive: ()=> copy.Data( $bog_basket_drive ),
				lord: ()=> auth.pass().lord(),
			}) as $$.$bog_basket_app
			const pages = $mol_wire_async({ list: ()=> guest.pages() })

			await wire( land, copy )
			$mol_assert_equal( await pages.list(), [ guest.Admission() ] )

			await staff( app ).admit( auth.pass(), 'Волонтёр 1' )
			await wire( land, copy )
			$mol_assert_equal( await pages.list(), [ guest.Points() ] )
			$mol_assert_equal( await $mol_wire_async({ title: ()=> ( guest.Points() as $$.$bog_basket_points ).drive_title() }).title(), 'Пример сбора' )
		},

		async 'offline phones of one point sum up'( $ ) {
			const app = await app_example( $ )
			const land = app.drive().land()
			const first = $.$giper_baza_auth.grab()
			const second = $.$giper_baza_auth.grab()
			const office = staff( app )
			await office.admit( first.pass(), 'Волонтёр 1' )
			await office.admit( second.pass(), 'Волонтёр 2' )
			const left = phone( $, land, first )
			const right = phone( $, land, second )
			await wire( land, left.copy )
			await wire( land, right.copy )

			await left.ops.accept( 5 )
			await right.ops.accept( 7 )
			await wire( left.copy, land )
			await wire( right.copy, land )

			$mol_assert_equal( await office.got(), 31 + 5 + 7 )
		},

		async 'dismissed volunteer keeps counted goods'( $ ) {
			const app = await app_example( $ )
			const land = app.drive().land()
			const auth = $.$giper_baza_auth.grab()
			const office = staff( app )
			await office.admit( auth.pass(), 'Волонтёр 1' )
			const guest = phone( $, land, auth )
			await wire( land, guest.copy )
			await guest.ops.accept( 5 )
			await wire( guest.copy, land )
			$mol_assert_equal( await office.got(), 36 )

			await office.dismiss( auth.pass().lord() )
			$mol_assert_equal( land.lord_rank( auth.pass().lord() ), $giper_baza_rank_deny )
			$mol_assert_equal( await office.got(), 36 )
			$mol_assert_equal( await office.shifts(), 2 )

			await guest.ops.accept( 9 )
			await wire( guest.copy, land )
			$mol_assert_equal( await office.got(), 36 )
		},

	})

}
