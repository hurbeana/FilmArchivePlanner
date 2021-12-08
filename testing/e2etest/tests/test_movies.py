from tests import *
from tempfile import TemporaryDirectory


def test_movie_update(movie):
    updated_movie = dict(movie)
    new_file = cache_file(scp)
    updated_movie["movieFiles"].append(new_file)
    updated_movie = update_movie(movie["id"], updated_movie)
    assert updated_movie["dcpFiles"] is not None
    assert updated_movie["movieFiles"] is not None
    assert movie["movieFiles"][0] in updated_movie["movieFiles"]
    assert len(updated_movie["movieFiles"]) > 1
    assert any(
        f["id"] != movie["movieFiles"][0]["id"] for f in updated_movie["movieFiles"]
    )
    assert all(f["path"] for f in updated_movie["movieFiles"])


def test_get_movie(movie):
    assert movie == get_movie(movie["id"])
