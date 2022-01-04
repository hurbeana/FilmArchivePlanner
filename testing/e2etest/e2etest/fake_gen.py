from faker import Faker
from faker.providers import BaseProvider
import random
from enum import Enum

Faker.seed(69)
fake = Faker(["en", "de"])
en_fake = Faker()
de_fake = Faker(["de"])


class TagAnimationProvider(BaseProvider):
    def animation(self):
        return random.choice(
            [
                "Still",
                "Stop Motion",
                "Drawn",
                "Photography",
                "Artsy",
                "Colored",
                "Digital",
                "Unique",
                "Traditional",
            ]
        )


class TagLanguageProvider(BaseProvider):
    def language(self):
        return random.choice(
            ["English", "Chinese", "Italian", "Spanish", "Hindi", "Japanese"]
        )


class TagSubmissionCategoryProvider(BaseProvider):
    def category(self):
        return random.choice(["Handin", "Premiere", "Draft"])


class TagContactProvider(BaseProvider):
    def contact(self):
        return random.choice(
            ["Company", "Studio", "University", "Government", "School", "Artist"]
        )


class TagSoftwareProvider(BaseProvider):
    def software(self):
        return random.choice(["Adobe Animate", "Toonmontion", "Generic"])

class TagSelectionProvider(BaseProvider):
    def selection(self):
        return random.choice(["Selection Tag 1", "Selection Tag 2", "Selection Tag 3"])


en_fake.add_provider(TagAnimationProvider)
en_fake.add_provider(TagSubmissionCategoryProvider)
en_fake.add_provider(TagContactProvider)
en_fake.add_provider(TagLanguageProvider)
en_fake.add_provider(TagSoftwareProvider)
en_fake.add_provider(TagSelectionProvider)


def random_director():
    return {
        "firstName": fake.first_name(),
        "middleName": fake.first_name(),
        "lastName": fake.last_name(),
    }


def random_movie(
    directors,
    submissionCategories,
    contact,
    animationTechniques=[],
    software=[],
    countries=[],
    dialogLanguages=[],
    keywords=[],
    selectionTags=[],
):
    def cap(words):
        capitalized_words = list(map(lambda x: x.capitalize(), words))
        return " ".join(capitalized_words)

    return {
        "originalTitle": cap(de_fake.words()),
        "englishTitle": cap(en_fake.words()),
        "directors": [{"id": d["id"]} for d in directors],
        "countriesOfProduction": [{"id": c["id"]} for c in countries],
        "yearOfProduction": random.randrange(1900, 2022),
        "duration": random.randrange(50, 150),
        "keywords": [{"id": k["id"]} for k in keywords],
        "germanSynopsis": de_fake.paragraph(
            nb_sentences=random.randrange(1, 20), variable_nb_sentences=True
        ),
        "englishSynopsis": en_fake.paragraph(
            nb_sentences=random.randrange(1, 20), variable_nb_sentences=True
        ),
        "submissionCategories": [{"id": s["id"]} for s in submissionCategories],
        "hasDialog": random.choice([True, False]),
        "dialogLanguages": [{"id": d["id"]} for d in dialogLanguages],
        "hasSubtitles": random.choice([True, False]),
        "isStudentFilm": random.choice([True, False]),
        "script": fake.paragraph(
            nb_sentences=random.randrange(1, 50), variable_nb_sentences=True
        ),
        "animation": fake.word(),
        "softwareUsed": [{"id": s["id"]} for s in software],
        "animationTechniques": [{"id": a["id"]} for a in animationTechniques],
        "contact": {"id": contact["id"]},
        "selectionTags": [{"id": t["id"]} for t in selectionTags],
    }


def random_contact(contact_tag):
    return {
        "type": {"id": contact_tag["id"]},
        "name": fake.name(),
        "email": fake.email(),
        "phone": fake.phone_number(),
        "website": fake.url(),
    }


class Tag(Enum):
    ANIMATION = "Animation"
    CATEGORY = "Category"
    CONTACT = "Contact"
    COUNTRY = "Country"
    KEYWORD = "Keyword"
    LANGUAGE = "Language"
    SOFTWARE = "Software"
    SELECTION = "Selection"


def random_tag(tag_type: Tag):
    tag_funcs = {
        Tag.ANIMATION: en_fake.animation,
        Tag.CATEGORY: en_fake.category,
        Tag.CONTACT: en_fake.contact,
        Tag.COUNTRY: en_fake.country,
        Tag.KEYWORD: en_fake.word,
        Tag.LANGUAGE: en_fake.language,
        Tag.SOFTWARE: en_fake.software,
        Tag.SELECTION: en_fake.selection,
    }
    return {
        "type": tag_type.value,
        "value": tag_funcs[tag_type](),
        "user": fake.name().replace(" ", "_"),
        "public": True,
    }
