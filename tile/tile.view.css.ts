namespace $.$$ {

	$mol_style_define( $bog_basket_tile, {
		align: {
			items: 'center',
		},
		background: {
			color: $mol_theme.card,
		},
		border: {
			radius: $mol_gap.round,
		},
		'@': {
			bog_basket_tile_full: {
				true: {
					color: $mol_theme.shade,
				},
			},
		},
		Add: {
			flex: {
				direction: 'column',
				grow: 1,
				shrink: 1,
				basis: 0,
			},
			align: {
				items: 'stretch',
			},
			minHeight: '4.5rem',
			minWidth: 0,
			userSelect: 'none',
		},
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
		Progress: {
			flex: {
				basis: '0.5rem',
				grow: 0,
			},
			width: '100%',
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
		Mine: {
			minWidth: '2.5rem',
			flex: {
				shrink: 0,
			},
			justify: {
				content: 'center',
			},
			font: {
				size: '1.25rem',
			},
			color: $mol_theme.focus,
		},
		Drop: {
			minWidth: '3rem',
			flex: {
				shrink: 0,
			},
			minHeight: '4.5rem',
			justify: {
				content: 'center',
			},
			align: {
				items: 'center',
			},
		},
	} )

}
