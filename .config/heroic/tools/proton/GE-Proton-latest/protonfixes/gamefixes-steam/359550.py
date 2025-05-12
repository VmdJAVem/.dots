"""Game fix for Rainbow Six Siege"""

from protonfixes import util


def main() -> None:
    """Game ships with outdated and not working uPlay launcher."""
    util.disable_uplay_overlay()
    util.set_environment('vk_x11_override_min_image_count', '2')
    util.protontricks('ubisoftconnect')
