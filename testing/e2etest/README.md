# E2E Backend Testing

## Installation

You will need to install setup this project locally. For this you will need Python 3 and [Python Poetry](https://python-poetry.org/).

Please install both and make sure you can run poetry, using `poetry -v`.

## Setup

First install the project in a venv using `poetry install`.

Afterwards you can enter the venv in your shell using `poetry shell`.

Make sure to also start the backend project, db and sftp containers via compose before running the tests.

## Usage

You can either load the venv with `poetry shell` or run a command inside the venv with `poetry run COMMAND`

The new command available is called `create`:

Examples of how to use the command:

- `create movie` - creates one movie
- `create -t 10 movie` - creates 10 movies

See `create --help` for further documentation and available subcommands

## Running the tests

Either from your virtual env run `pytest` or you can also run `poetry run pytest` from outside the venv (if you have not entered the `poetry shell` command).

Good flags for `pytest` are `-s`, `-x` and `-k` (refer to the docs of pytest or `pytest -h` what they mean and how to use them).
