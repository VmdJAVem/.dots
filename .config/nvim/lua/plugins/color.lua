return {
  {
    "catppuccin/nvim",
    name = "catppuccin",
    priority = 1000, -- Ensure it loads first
    opts = {
      flavour = "macchiato", -- Specify Mocha flavor
      integrations = {
        aerial = true,
        alpha = true,
        cmp = true,
        gitsigns = true,
        treesitter = true,
        telescope = true,
        native_lsp = {
          enabled = true,
          underlines = {
            errors = { "undercurl" },
            warnings = { "undercurl" },
          },
        },
        -- Add other integrations as needed :cite[1]:cite[2]
      },
    },
  },
  -- Configure LazyVim to load Catppuccin
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "catppuccin",
    },
  },
}
