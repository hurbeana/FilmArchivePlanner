from tests import *


def test_update_director(director):
    english_file = director["biographyEnglish"]
    new_file = cache_file(scp)
    updated_director = dict(director)
    updated_director["biographyGerman"] = new_file
    new_director = update_director(director["id"], updated_director)
    assert director["biographyGerman"] is None
    assert english_file["id"] == new_director["biographyEnglish"]["id"]
    assert new_director["biographyGerman"] is not None


def test_get_director(director):
    assert director == get_director(director["id"])
