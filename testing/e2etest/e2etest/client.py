import mimetypes
import random
from namegenerator import gen
from e2etest import files
from pprint import pformat
import logging

from requests import post, get

logger = logging.getLogger(__name__)


class Client:
    def __init__(self, base_url="http://localhost:3000") -> None:
        self.base_url = base_url
        self.tags = {t["value"]: t for t in self.get_tags()}

    def get_tags(self):
        r = get(f"{self.base_url}/tags?limit=99999999")
        r.raise_for_status()
        return r.json()["items"]

    def cache_file(self, file_path):
        files = [
            (
                "file",
                (
                    f"{gen(separator='_')}{file_path.suffix}",
                    file_path.open("rb"),
                    mimetypes.guess_type(file_path),
                ),
            )
        ]

        r = post(f"{self.base_url}/files/cache", files=files)
        r.raise_for_status()
        return {"id": r.json()["id"]}

    def create_director(self, director):
        director["biographyEnglish"] = self.cache_file(files.get_pdf())
        if bool(random.getrandbits(1)):
            director["biographyGerman"] = self.cache_file(files.get_pdf())
        if bool(random.getrandbits(1)):
            director["filmography"] = self.cache_file(files.get_pdf())

        r = self.post_json("Posting Director", director, "/directors")

        return r.json()

    def create_contact(self, contact):
        r = self.post_json("Posting Contact", contact, "/contacts")
        return r.json()

    def create_tag(self, tag):
        if tag["value"] in self.tags:
            logger.info("Returning existing Tag")
            logger.info("\n" + pformat(self.tags[tag["value"]]))
            return self.tags[tag["value"]]
        r = self.post_json("Posting new Tag", tag, "/tags")
        new_tag = r.json()
        tag["value"] = new_tag
        return new_tag

    def create_movie(self, movie):
        movie["movieFiles"] = [
            self.cache_file(files.get_mp4()) for i in range(random.randrange(1, 2))
        ]

        movie["dcpFiles"] = [
            self.cache_file(files.get_mp4()) for i in range(random.randrange(0, 4))
        ]
        if bool(random.getrandbits(1)):
            movie["previewFile"] = self.cache_file(files.get_mp4())
        if bool(random.getrandbits(1)):
            movie["trailerFile"] = self.cache_file(files.get_mp4())
        movie["stillFiles"] = [
            self.cache_file(files.get_png()) for i in range(random.randrange(0, 3))
        ]

        movie["subtitleFiles"] = [
            self.cache_file(files.get_png()) for i in range(random.randrange(0, 2))
        ]

        return self.post_json("Posting new Movie", movie, "/movies").json()

    def post_json(self, text, json, path):
        logger.info(text)
        logger.info("\n" + pformat(json))
        result = post(f"{self.base_url}{path}", json=json)
        result.raise_for_status()
        return result
