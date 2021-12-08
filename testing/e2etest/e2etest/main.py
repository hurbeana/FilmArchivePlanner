import click
from e2etest.client import *
from e2etest.fake_gen import *
from pprint import pformat
import logging
import enlighten
from tests import create_tag

logging.getLogger("urllib3").setLevel(logging.ERROR)
logformat = "[%(levelname)-8s] |%(asctime)s| - %(name)-18s@%(lineno)-3d - %(funcName)-22s - %(message)s"
formatter = logging.Formatter(logformat)
logging.basicConfig(level=logging.DEBUG, format=logformat)
logger = logging.getLogger(__name__)

manager = enlighten.get_manager()


def create_pbar(desc, total):
    return manager.counter(total=total, desc=desc, unit="entities", leave=False)


def create_contacts(client, times):
    pbar = create_pbar("Creating Contacts", times)
    contacts = []
    for _ in range(times):
        contacts.append(
            client.create_contact(
                random_contact(create_tags(client, 1, Tag.CONTACT)[0])
            )
        )
        pbar.update()
    pbar.close()
    return contacts


def create_directors(client, times):
    pbar = create_pbar("Creating Directors", times)
    dirs = []
    for _ in range(times):
        dirs.append(client.create_director(random_director()))
        pbar.update()
    pbar.close()
    return dirs


def create_tags(client, times, tag_type: Tag):
    pbar = create_pbar("Creating Tags", times)
    tags = []
    for _ in range(times):
        tags.append(client.create_tag(random_tag(tag_type)))
        pbar.update()
    pbar.close()
    return tags


def create_movies(client, times):
    pbar = create_pbar("Creating Movies", times)
    movies = []
    for _ in range(times):
        directors = create_directors(client, random.randrange(1, 3))
        submissionCats = create_tags(
            client, random.randrange(1, 3), tag_type=Tag.CATEGORY
        )
        contact = create_contacts(client, 1)[0]
        animationTech = create_tags(
            client, random.randrange(0, 3), tag_type=Tag.ANIMATION
        )
        software = create_tags(client, random.randrange(0, 3), tag_type=Tag.SOFTWARE)
        countries = create_tags(client, random.randrange(0, 3), tag_type=Tag.COUNTRY)
        langs = create_tags(client, random.randrange(0, 3), tag_type=Tag.LANGUAGE)
        keywords = create_tags(client, random.randrange(0, 5), tag_type=Tag.KEYWORD)
        movies.append(
            client.create_movie(
                random_movie(
                    directors=directors,
                    submissionCategories=submissionCats,
                    contact=contact,
                    animationTechniques=animationTech,
                    software=software,
                    countries=countries,
                    dialogLanguages=langs,
                    keywords=keywords,
                )
            )
        )
        pbar.update()
    pbar.close()
    return movies


def log_result(text, result):
    logger.info(text)
    logger.info("\n" + pformat(result))


@click.group()
@click.option("-t", "--times", default=1)
@click.option("-u", "--url", default="http://localhost:3000")
@click.pass_context
def cli(ctx, times, url):
    ctx.ensure_object(dict)
    logger.info("Creating Client...")
    client = Client(url)
    ctx.obj["TIMES"] = int(times)
    ctx.obj["CLIENT"] = client


@cli.command()
@click.pass_context
def contact(ctx):
    contacts = create_contacts(ctx.obj["CLIENT"], ctx.obj["TIMES"])
    log_result("Created following contacts:", contacts)


@cli.command()
@click.pass_context
def director(ctx):
    directors = create_directors(ctx.obj["CLIENT"], ctx.obj["TIMES"])
    log_result("Created following directors:", directors)


@cli.command()
@click.pass_context
def movie(ctx):
    directors = create_movies(ctx.obj["CLIENT"], ctx.obj["TIMES"])
    log_result("Created following movies:", directors)


@cli.command()
@click.pass_context
def tag(ctx):
    tags = create_tags(
        ctx.obj["CLIENT"], ctx.obj["TIMES"], random.choice([e.value for e in Tag])
    )
    log_result("Created following tags:", tags)
