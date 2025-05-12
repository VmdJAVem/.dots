#!/bin/bash
# arch-pkg-transfer: Transfer Arch Linux packages between machines
set -e

BACKUP_DIR="$HOME/arch-pkg-backup"
OFFICIAL_LIST="$BACKUP_DIR/official_pkglist.txt"
AUR_LIST="$BACKUP_DIR/aur_pkglist.txt"

help() {
  echo "Usage: $0 [--backup|--restore|--install-aur-helper]"
  echo
  echo "Options:"
  echo "  --backup              Create package lists in $BACKUP_DIR"
  echo "  --restore             Install packages from existing lists"
  echo "  --install-aur-helper  Install yay AUR helper"
  echo
  echo "Backup files will be saved to: $BACKUP_DIR"
}

backup_packages() {
  echo "Creating backup directory: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"

  echo "Generating official package list..."
  comm -23 <(pacman -Qqe | sort) <(pacman -Qqm | sort) >"$OFFICIAL_LIST"

  echo "Generating AUR package list..."
  pacman -Qqm >"$AUR_LIST"

  echo -e "\nPackage lists created:"
  echo "Official: $OFFICIAL_LIST"
  echo "AUR:      $AUR_LIST"
  echo -e "\nTransfer these files to your new machine."
}

restore_packages() {
  if [[ ! -f "$OFFICIAL_LIST" || ! -f "$AUR_LIST" ]]; then
    echo "Error: Package lists not found in $BACKUP_DIR"
    echo "Copy your backup files to this directory and try again"
    exit 1
  fi

  echo "Updating system..."
  sudo pacman -Syu --noconfirm

  echo -e "\nInstalling official packages..."
  sudo pacman -S --needed --noconfirm - <"$OFFICIAL_LIST"

  echo -e "\nChecking for AUR helper..."
  if ! command -v yay &>/dev/null; then
    echo "Yay not found. Run with --install-aur-helper first"
    exit 1
  fi

  echo -e "\nInstalling AUR packages..."
  yay -S --needed --noconfirm - <"$AUR_LIST"

  echo -e "\nPackage restoration complete!"
}

install_aur_helper() {
  echo "Installing yay AUR helper..."
  sudo pacman -S --needed --noconfirm git base-devel
  rm -rf /tmp/yay-install
  git clone https://aur.archlinux.org/yay.git /tmp/yay-install
  (cd /tmp/yay-install && makepkg -si --noconfirm)
  rm -rf /tmp/yay-install
}

case "$1" in
"--backup")
  backup_packages
  ;;
"--restore")
  restore_packages
  ;;
"--install-aur-helper")
  install_aur_helper
  ;;
*)
  help
  exit 1
  ;;
esac
