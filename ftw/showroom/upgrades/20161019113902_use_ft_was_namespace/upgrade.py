from ftw.upgrade import UpgradeStep


class UseFTWasNamespace(UpgradeStep):
    """Use ft was namespace.
    """

    def __call__(self):
        self.install_upgrade_profile()
