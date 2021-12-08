from random import choice
from pathlib import Path


def get_png():
    return choice(list((Path(__file__).parent / "imgs").glob("*")))


def get_mp4():
    return choice(list((Path(__file__).parent / "mp4s").glob("*")))


def get_pdf():
    return choice(list((Path(__file__).parent / "cvs").glob("*")))
