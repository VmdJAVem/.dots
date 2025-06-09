return {
	-- Configure gruvbox with transparency disabled
	{
		"ellisonleao/gruvbox.nvim",
		opts = {
			transparent_mode = false, -- Disable gruvbox's transparency
			contrast = "hard", -- Optional: keep your contrast setting
		},
		-- Ensures gruvbox loads before LazyVim's colorscheme setup
		priority = 1000,
	},

	-- Configure LazyVim (no transparency options needed here)
	{
		"LazyVim/LazyVim",
		opts = {
			colorscheme = "gruvbox",
		},
	},
}
