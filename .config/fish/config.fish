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
echo 'function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end' >>~/.config/fish/config.fish
# Homebrew setup
eval (/home/linuxbrew/.linuxbrew/bin/brew shellenv)

# fzf key bindings and fuzzy completion
fzf --fish | source

# PATH configuration
set -gx PATH $PATH /home/vmdjavem/.local/bin

#zoxide
zoxide init fish | source
#fetch
bestfetch
set -q GHCUP_INSTALL_BASE_PREFIX[1]; or set GHCUP_INSTALL_BASE_PREFIX $HOME
set -gx PATH $HOME/.cabal/bin $PATH /home/vmdjavem/.ghcup/bin # ghcup-env
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
function sklaunch
    set -x DRI_PRIME 1
    set -x _JAVA_AWT_WM_NONREPARENTING 1
    set -x GDK_BACKEND x11
    set -x OZONE_PLATFORM x11
    java -Dsun.java2d.opengl=true -jar ~/bin/SKlauncher-3.2.12.jar
end
