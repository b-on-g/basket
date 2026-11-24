namespace $.$$ {

	$mol_style_define( $bog_basket_bar, {
		flex: {
			direction: 'column',
			grow: 1,
		},
		minWidth: 0,
		gap: $mol_gap.space,
		Head: {
			flex: {
				wrap: 'wrap',
			},
			justify: {
				content: 'space-between',
			},
			align: {
				items: 'baseline',
			},
			gap: $mol_gap.space,
		},
		Title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},
		Total: {
			whiteSpace: 'nowrap',
		},
		Progress: {
			flex: {
				basis: '0.5rem',
				grow: 0,
			},
			width: '100%',
		},
	} )

}
