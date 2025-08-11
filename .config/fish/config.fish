# ~/.config/fish/config.fish

# Aliases
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias minecraft='java -jar ~/bin/SKlauncher-3.2.12.jar'
alias unimatrix='unimatrix -n -s 96 -l o'
alias neofetch='command neofetch --source ~/neofetch_ascii/aphex_twin'
alias clock='tty-clock -c -s -b -f "%H:%M:%S" -C 3 -B "#6a2c8d" -t'
alias cowsay='fortune | command cowsay -f stegosaurus'
alias config='/usr/bin/git --git-dir=$HOME/poo --work-tree=$HOME'
alias archfetch='neofetch --source ~/neofetch_ascii/arch.txt'
alias cd='z'
alias vim='nvim'
alias myclock='~/bin/myclock'
alias pdf='zpdf $(fzf)'
alias gvim="nvim --listen /tmp/godothost"
set EDITOR = nvim
function fish_greeting
    echo "hi :3"
end
# Prompt customization
function fish_prompt
    echo -n " λ "
    if test (pwd) = $HOME
        echo -n "~"
        echo -n " "
    else
        echo -n (basename (pwd))
        set_color normal
        echo -n " "
    end
end
function fish_right_prompt
    # Use printf to right-align mommy's output dynamically
    printf "%*s" $COLUMNS (mommy -1 -s $status)
end
# Homebrew setup
eval (/home/linuxbrew/.linuxbrew/bin/brew shellenv)

# fzf key bindings and fuzzy completion
fzf --fish | source

# PATH configuration
set -gx PATH $PATH /home/vmdjavem/.local/bin
# pdfs
function zpdf
    for file in $argv
        nohup zathura "$file" >/dev/null 2>&1 &
    end
end
function catfetch
    set stamp (date +%s)
    kitget --square -o "/tmp/kitget-$stamp"
    clear
    fastfetch --kitty "/tmp/kitget-$stamp" $argv
    rm -f "/tmp/kitget-$stamp"
end
#zoxide
zoxide init fish | source
#fetch
fastfetch
set -q GHCUP_INSTALL_BASE_PREFIX[1]; or set GHCUP_INSTALL_BASE_PREFIX $HOME
set -gx PATH $HOME/.cabal/bin $PATH /home/vmdjavem/.ghcup/bin # ghcup-env
