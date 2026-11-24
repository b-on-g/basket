namespace $ {

	function app_make( $: $ ) {
		const app = $bog_basket_app.make({ $ }) as $$.$bog_basket_app
		app.drive_open( '' )
		new $mol_wire_atom( 'bog_basket_test_home', ()=> app.home() ).fresh()
		return app
	}

	async function app_example( $: $, screen = 'count' ) {
		const app = app_make( $ )
		await $mol_wire_async( app ).example_open()
		app.screen( screen )
		keep( app )
		return app
	}

	function keep( app: $$.$bog_basket_app ) {
		new $mol_wire_atom( 'bog_basket_test_drive', ()=> app.drive().land() ).fresh()
		new $mol_wire_atom( 'bog_basket_test_shop', ()=> shop( app ).land() ).fresh()
	}

	function shop( app: $$.$bog_basket_app ) {
		return app.$.$giper_baza_glob.Land( new $giper_baza_link( app.drive().Shop()!.val()! ) ).Data( $bog_basket_shop )
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
			$mol_assert_equal( ( tile.Bar() as $$.$bog_basket_bar ).total_text(), '2 из 80' )
			$mol_assert_equal( counter.summary_text(), 'Наборов 0 из 40, за смену принято 2' )

			counter.Finish().click()
			$mol_assert_equal( app.pages(), [ app.Points() ] )
		},

		async 'unfinished shift is found when the phone forgot it'( $ ) {
			const app = await app_example( $ )
			app.shift_start( app.drive().Points()!.items()[2].head().str )
			const shift = app.shift_id()
			$.$mol_state_local.value( `bog_basket_shift:${ app.drive_id() }`, null )

			$mol_assert_equal( app.shift_id(), shift )
			$mol_assert_equal( app.pages(), [ app.Counter( shift ) ] )
		},

		async 'copy of a dismissed shift is not continued'( $ ) {
			const app = await app_example( $ )
			app.shift_start( app.drive().Points()!.items()[2].head().str )
			app.shift( app.shift_id() ).Source( 'auto' )!.val( 'original' )
			$.$mol_state_local.value( `bog_basket_shift:${ app.drive_id() }`, null )

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
			const guest = $$.$bog_basket_app.make({
				$,
				drive: ()=> copy.Data( $bog_basket_drive ),
				lord: ()=> auth.pass().lord(),
			})
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

		async 'coordinator creates a drive with a kit and adds a point'( $ ) {
			const app = app_make( $ )
			$mol_assert_equal( app.Create_run().enabled(), false )
			app.Create_title().value( 'Марафон в Самаре' )
			$mol_assert_equal( app.Create_run().enabled(), true )
			await $mol_wire_async( app ).create()
			keep( app )

			const office = app.Office() as $$.$bog_basket_office
			$mol_assert_equal( app.pages(), [ office ] )
			$mol_assert_equal( office.drive_title(), 'Марафон в Самаре' )
			$mol_assert_equal( office.good_rows().length, $bog_basket_example_goods.length )
			$mol_assert_equal( $bog_basket_goods( app.drive() ).every( good => !good.Price()?.val() ), true )

			office.Point_new_title().value( 'Универсам' )
			office.Point_new_add().click()
			const id = app.drive().Points()!.items()[0].head().str
			$mol_assert_equal( office.point_rows().length, 1 )

			app.screen( 'spot' )
			app.spot_id( id )
			const spot = app.Spot( id ) as $$.$bog_basket_spot
			$mol_assert_equal( app.pages(), [ office, spot ] )
			spot.Kits().value( 15 )
			$mol_assert_equal( office.point_plan( id ), 15 )
			$mol_assert_equal( spot.good_need( $bog_basket_goods( app.drive() )[0].head().str ), 30 )

			spot.Drop().click()
			$mol_assert_equal( office.point_rows().length, 0 )
			$mol_assert_equal( app.pages(), [ office ] )
		},

		async 'office sums points and tells what is lacking'( $ ) {
			const app = await app_example( $, '' )
			const office = app.Office() as $$.$bog_basket_office
			const buckwheat = $bog_basket_goods( app.drive() )[0].head().str

			$mol_assert_equal( office.good_got( buckwheat ), 31 + 12 )
			$mol_assert_equal( office.good_need( buckwheat ), 70 * 2 )
			$mol_assert_equal( office.total_text(), 'Принято 264 шт., 139 кг. Наборов готово 8 из 70.' )
			$mol_assert_equal(
				office.point_note( app.drive().Points()!.items()[0].head().str ),
				'Смен идёт: 1, не хватает: масло в пластике, тушёнка в жести',
			)
		},

		async 'summary table opens in a spreadsheet'( $ ) {
			const app = await app_example( $, '' )
			const rows = $mol_csv_parse_table( $bog_basket_csv( app.drive() ), ';' )
			$mol_assert_equal( rows.length, 1 + $bog_basket_example_points.length )
			$mol_assert_equal( rows[0].slice( 0, 6 ), [ 'Точка', 'Адрес', 'Наборов план', 'Наборов готово', 'Гречка, принято', 'Гречка, план' ] )
			$mol_assert_equal( rows[1].slice( 2, 6 ), [ '20', '6', '31', '40' ] )
		},

		async 'coordinator admits by the link of a volunteer and dismisses'( $ ) {
			const app = await app_example( $, '' )
			const team = app.Team() as $$.$bog_basket_team
			const pass = $.$giper_baza_auth.grab().pass()
			const lord = pass.lord().str

			team.paste( `https://b-on-g.github.io/basket/#!drive=${ app.drive_id() }/admit=${ pass }` )
			$mol_assert_equal( app.admit(), pass.toString() )
			$mol_assert_equal( app.pages(), [ app.Office(), team ] )
			$mol_assert_equal( team.Admit().enabled(), true )

			team.Name().value( 'Смелый' )
			await $mol_wire_async( team ).admit_run()
			$mol_assert_equal( app.admit(), '' )
			$mol_assert_equal( team.people_rows(), [ team.Person( lord ) ] )
			$mol_assert_equal( [ team.person_name( lord ), team.person_status( lord ) ], [ 'Смелый', 'допущен' ] )

			await $mol_wire_async( team ).dismiss( lord )
			$mol_assert_equal( team.person_status( lord ), 'отозван' )
			$mol_assert_equal( team.person_sub( lord )[2], team.Restore( lord ) )
			await $mol_wire_async( team ).restore( lord )
			$mol_assert_equal( team.person_status( lord ), 'допущен' )
		},

		async 'broken admission link is refused'( $ ) {
			const app = await app_example( $, '' )
			const team = app.Team() as $$.$bog_basket_team
			app.admit( 'abc' )
			$mol_assert_equal( team.Admit().enabled(), false )
			$mol_assert_equal( team.pending_text().startsWith( 'Ссылка повреждена' ), true )
		},

		async 'good with accepted items can not be removed from the kit'( $ ) {
			const app = await app_example( $, '' )
			const kit = app.Kit() as $$.$bog_basket_kit
			const first = $bog_basket_goods( app.drive() )[0].head().str
			$mol_assert_equal( kit.droppable( first ), false )
			$mol_assert_equal( kit.row_head( first ), [ kit.Good_title( first ) ] )

			kit.Add().click()
			const fresh = $bog_basket_goods( app.drive() ).at( -1 )!.head().str
			$mol_assert_equal( kit.rows().length, $bog_basket_example_goods.length + 1 )
			kit.Drop( fresh ).click()
			$mol_assert_equal( kit.rows().length, $bog_basket_example_goods.length )
		},

		async 'buyer gets the most needed goods for the sum'( $ ) {
			const app = await app_example( $, '' )
			await $mol_wire_async({ publish: ()=> $bog_basket_shop_publish( app.drive(), new $mol_time_moment( '2026-11-28T10:00' ) ) }).publish()
			const id = app.drive().Points()!.items()[0].head().str
			$mol_assert_equal( app.buyer_link( id ).includes( shop( app ).land().link().str ), true )
			$mol_assert_equal( app.buyer_link( id ).includes( id ), true )

			const buyer = $$.$bog_basket_buyer.make({ $, shop: ()=> shop( app ) })
			$mol_assert_equal( buyer.point_rows().length, $bog_basket_example_points.length )
			buyer.point_open( id )
			$mol_assert_equal( buyer.point_current()!.title, 'Точка 1' )

			buyer.money( 500 )
			const goods = buyer.point_current()!.goods
			const sum = buyer.counts().reduce( ( sum, count, index )=> sum + count * goods[ index ].price, 0 )
			$mol_assert_equal( sum > 400 && sum <= 500, true )
			$mol_assert_equal( buyer.counts()[4] > 0, true )
			$mol_assert_equal( buyer.counts()[2], 0 )

			buyer.money( 10 )
			$mol_assert_equal( buyer.good_rows().length, 0 )
			$mol_assert_equal( buyer.note_text(), 'На эту сумму ничего из нужного не купить.' )
		},

		async 'published shop does not change without new goods'( $ ) {
			const app = await app_example( $, '' )
			const publish = ( time: string )=> $mol_wire_async({ run: ()=> $bog_basket_shop_publish( app.drive(), new $mol_time_moment( time ) ) }).run()
			const hour = ()=> shop( app ).Updated()!.val()!.hour
			await publish( '2026-11-28T10:00' )
			await publish( '2026-11-28T11:00' )
			$mol_assert_equal( hour(), 10 )

			app.shift_start( app.drive().Points()!.items()[0].head().str )
			const counter = app.Counter( app.shift_id() ) as $$.$bog_basket_counter
			;( counter.tiles()[0] as $$.$bog_basket_tile ).Add().click()
			await publish( '2026-11-28T12:00' )
			$mol_assert_equal( hour(), 12 )
		},

	})

}
