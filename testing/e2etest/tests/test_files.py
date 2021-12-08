import shutil
from tests import *
import paramiko
from pathlib import Path
import imghdr
from shutil import rmtree


def test_delete_file(director):
    delete_file(director["biographyEnglish"]["id"], "biography_english_file")
    username, password = "testuser", "testpwd"
    filepath = (
        Path(director["biographyEnglish"]["path"])
        / director["biographyEnglish"]["filename"]
    )
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect("localhost", username=username, password=password)
    sftp = ssh.open_sftp()
    try:
        sftp.stat(str(filepath))
        assert False
    except FileNotFoundError:
        assert True
    ssh.close()
    assert get_director(director["id"])["biographyEnglish"] is None


def test_get_file(director):
    filepath = get_file(director["biographyEnglish"]["id"], "biography_english_file")
    logger.info(filepath)
    hdr = imghdr.what(filepath)
    assert hdr is not None
    rmtree(str(filepath.parent))
