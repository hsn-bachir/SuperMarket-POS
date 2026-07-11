from .models import SystemSettings


def get_settings():
    return SystemSettings.load()


def get_exchange_rate():
    return get_settings().exchange_rate


def get_base_currency():
    return get_settings().base_currency