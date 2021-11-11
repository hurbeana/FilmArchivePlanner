## End-2-End Test
To run the end to end tests, first
``` source e2e.test.env ```

This sets up the environment for the e2e tests,
changing the default db name and set the test command to execute when starting docker

In the same terminal session:

``` docker comppose up backend db ```

Will start the backend and test db, e2e tests will be executed
