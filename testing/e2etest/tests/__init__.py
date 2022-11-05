from pathlib import Path
import mimetypes
import json
from namegenerator import gen
import pytest
from tempfile import mkdtemp

from requests import get, put, delete, post

base_url = "http://localhost:3000"
# scp = Path(__file__).parent / "files" / "screenshot.png"
scp = Path(__file__).parent / "files" / "sample.mp4"


def cache_file(file_path: Path):
    payload = {}
    files = [
        (
            "file",
            (
                f"{gen(separator='_')}.png",
                file_path.open("rb"),
                mimetypes.guess_type(file_path),
            ),
        )
    ]
    headers = {}

    r = post(f"{base_url}/files/cache",
             headers=headers, data=payload, files=files)
    r.raise_for_status()
    return {"id": r.json()["id"]}


def create_director():
    payload = {
        "firstName": "testdirector",
        "lastName": "hurdurr",
        "biographyEnglish": cache_file(scp),
    }

    r = post(f"{base_url}/directors", json=payload)
    r.raise_for_status()
    return r.json()


def create_contact(contact_tag):
    payload = {
        "type": {"id": contact_tag["id"]},
        "name": "Duis pariatur laborum exercitation",
        "email": "deserunt tempor dolor laboris",
        "phone": "cons",
        "website": "proident laboris pariatur",
    }

    r = post(f"{base_url}/contacts", json=payload)
    r.raise_for_status()
    return r.json()


def create_tag(tagtype):
    payload = {"type": tagtype, "value": "a", "user": "b", "public": True}

    r = post(f"{base_url}/tags", json=payload)
    r.raise_for_status()
    return r.json()


def update_director(did, new_director):
    del new_director["id"]
    del new_director["created_at"]
    del new_director["last_updated"]
    director = json.dumps(new_director)

    r = put(
        f"{base_url}/directors/{did}",
        headers={"Content-Type": "application/json"},
        data=director,
    )
    r.raise_for_status()
    return r.json()


def create_movie(director, contact):
    subtag = create_tag("Category")
    movie = json.dumps(
        {
            "originalTitle": "Titanic",
            "englishTitle": "Titanic",
            "movieFiles": [cache_file(scp)],
            "dcpFiles": [cache_file(scp)],
            "previewFile": cache_file(scp),
            "stillFiles": [cache_file(scp)],
            "subtitleFiles": [cache_file(scp)],
            "directors": [{"id": director["id"]}],
            "countriesOfProduction": [],
            "yearOfProduction": 1997,
            "duration": 194,
            "keywords": [],
            "germanSynopsis": "Bissl Synopis hier rein",
            "englishSynopsis": "Some synopis goes here",
            "submissionCategories": [{"id": subtag["id"]}],
            "hasDialog": True,
            "dialogLanguages": [],
            "hasSubtitles": False,
            "isStudentFilm": False,
            "script": "Script here",
            "animation": "String",
            "softwareUsed": [],
            "animationTechniques": [],
            "contact": {"id": contact["id"]},
        }
    )

    r = post(
        f"{base_url}/movies",
        headers={"Content-Type": "application/json"},
        data=movie,
    )
    r.raise_for_status()
    return r.json()


def update_movie(mid, new_movie):
    del new_movie["id"]
    del new_movie["created_at"]
    del new_movie["last_updated"]
    movie = json.dumps(new_movie)

    r = put(
        f"{base_url}/movies/{mid}",
        headers={"Content-Type": "application/json"},
        data=movie,
    )
    r.raise_for_status()
    return r.json()


def get_movie(mid):
    r = get(f"{base_url}/movies/{mid}")
    r.raise_for_status()
    return r.json()


def get_director(did):
    r = get(f"{base_url}/directors/{did}")
    r.raise_for_status()
    return r.json()


def delete_file(fid, filetype):
    r = delete(f"{base_url}/files/{fid}?fileType={filetype}")
    r.raise_for_status()


def get_file(fid, filetype):
    with get(f"{base_url}/files/{fid}?fileType={filetype}") as r:
        r.raise_for_status()
        tmpd = Path(mkdtemp())
        filename = tmpd / f"{gen(separator='_')}.jpg"
        with open(filename, "wb") as f:
            f.write(r.content)
    return filename


@pytest.fixture
def movie():
    director = create_director()
    ctag = create_tag("Contact")
    contact = create_contact(ctag)
    return create_movie(director, contact)


@pytest.fixture
def director():
    return create_director()


@pytest.fixture
def contact():
    ctag = create_tag("Contact")
    return create_contact(ctag)
