from django.apps import AppConfig


class ConfigApp(AppConfig):
    name = 'config'

    def ready(self):
        from django.db.backends.signals import connection_created

        def set_wal_mode(sender, connection, **kwargs):
            if connection.vendor == 'sqlite':
                connection.cursor().execute('PRAGMA journal_mode=WAL;')
                connection.cursor().execute('PRAGMA synchronous=NORMAL;')

        connection_created.connect(set_wal_mode)
