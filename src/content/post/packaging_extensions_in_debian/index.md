---
title: "Packaging PostgreSQL extensions in Debian/Ubuntu Systems"
description: "A simple writeup to remeber how to package a pg extension on Debain/Ubuntu Linux"
publishDate: "01 July 2023"
draft: false
categories: ["postgresql","tech","open-source","Linux"]
coverImage:
   src: "./art.jpeg"
   alt: "Packaging PostgreSQL Slonik in Box"
---
<!-- ![art](art.jpeg) -->
Hi everyone,

[PostgreSQL](https://postgresql.org) has a great extensibility in features using extensions. Any feature that a user needs which isnt there natively can be added using extensions. to distribute extensions on different systems, packaging becomes important.

This blog lists down the steps to package a PostgreSQL extension in debian/ubuntu systems. I would be packaging a simple [base36](https://github.com/rajivharlalka/pg_extensions) extension to list down the steps.

### 1. Adding the sources list

To install postgresql packages in debian, the `apt.postgresql.org` apt list needs to be added. 

```bash
# Reference: https://wiki.postgresql.org/wiki/Apt
# Add gpg keys for verification
curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg >/dev/nul
#For downloading packages
sudo echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
#To also be able to download source files of packages deb-src also needs to be added
sudo echo "deb-src http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" >> /etc/apt/sources.list.d/pgdg.list
```

Run `apt install` to update the apt list repositry and be able to search for packages using apt command.

### 2. Setting up the directory

Get your extension source code in a directory. Next from the root of the extension directory, call [`dh_make_pgxs`](https://manpages.debian.org/bullseye/postgresql-server-dev-all/dh_make_pgxs.1.en.html) to setup the boilerplate for the debian folder. 
```bash
vagrant@ubuntu-focal:/vagrant/base36-0.0.1$ dh_make_pgxs
Upstream (-n): base36
Version (-v):  0.0.1
Source:        base36 (0.0.1-1)
Binaries:      postgresql-PGVERSION-base36 (0.0.1-1)
Uploader:       <vagrant@localhost>
Homepage (-h): https://FIXME/base36

Press Enter to continue, ^C to abort
Installing debian/control.in
Installing debian/copyright
Installing debian/gitlab-ci.yml
Installing debian/pgversions
Installing debian/rules
Creating debian/source/
Installing debian/source/format
Creating debian/tests/
Installing debian/tests/control
Installing debian/tests/installcheck
Installing debian/watch
Updating debian/control from debian/control.in
Creating debian/changelog
```

Post this a debian folder would be created. It has same structure of what `dh_make` creates hence the meaning of the files can be found anywhere on the internet.

### 3. Updating necessary files

After updating the nexecassry parts, the folder is ready to be built(incase of procedural languages) and packaged.

### 4. Build the extension

PostgreSQL has a cli tool pg_buildext which is extremely helpful in building the package. A great documentation of it is available on the [manpage](https://manpages.debian.org/stretch/postgresql-server-dev-all/pg_buildext.1.en.html) .

### 5. Package the extension

The final step comes to packaging the extension. To just verify there must be a README.* file in the root of the extension. 
Run the `dpkg_buildpackage` if a tarball of the source code already exists and  `dpkg_buildpackage -b` if not. This would test the extension on the supported pg versions and then create the necessary deb files ready to be shipped.

``` bash
vagrant@ubuntu-focal:/vagrant/base36-0.0.1$ dpkg-buildpackage -b
dpkg-buildpackage: info: source package base36
dpkg-buildpackage: info: source version 0.0.1-1
dpkg-buildpackage: info: source distribution UNRELEASED
dpkg-buildpackage: info: source changed by  <vagrant@localhost>
dpkg-buildpackage: info: host architecture amd64
 dpkg-source --before-build .
 debian/rules clean
dh clean --with pgxs
   dh_auto_clean --buildsystem=pgxs
        pg_buildext clean build-%v postgresql-%v-base36
rm -rf build-10/ build-11/ build-12/ build-13/ build-14/ build-15/
rm -rf debian/postgresql-10-base36/ debian/postgresql-11-base36/ debian/postgresql-12-base36/ debian/postgresql-13-base36/ debian/postgresql-14-base36/ debian/postgresql-15-base36/ debian/postgresql-10-base36.substvars debian/postgresql-11-base36.substvars debian/postgresql-12-base36.substvars debian/postgresql-13-base36.substvars debian/postgresql-14-base36.substvars debian/postgresql-15-base36.substvars
make[1]: Entering directory '/vagrant/base36-0.0.1'
rm -rf results/ regression.diffs regression.out tmp_check/ tmp_check_iso/ log/ output_iso/
make[1]: Leaving directory '/vagrant/base36-0.0.1'
   dh_clean
   pg_buildext checkcontrol
 debian/rules binary
dh binary --with pgxs
   dh_update_autotools_config
   dh_autoreconf
   dh_auto_configure
   dh_auto_build --buildsystem=pgxs
        pg_buildext build build-%v
---
building for each postgresql version
---
   create-stamp debian/debhelper-build-stamp
   dh_testroot
   dh_prep
   dh_auto_install --buildsystem=pgxs
        pg_buildext install build-%v postgresql-%v-base36
--- 
installing extension for each postgresql version 
make[1]: Entering directory '/vagrant/base36-0.0.1'
dh_installdocs --all README.*
make[1]: Leaving directory '/vagrant/base36-0.0.1'
   dh_installchangelogs
   dh_perl
   dh_link
   dh_pgxs_test
        pg_buildext installcheck . build-%v postgresql-%v-base36
---
running tests on each version
---

make[1]: Leaving directory '/vagrant/base36-0.0.1/build-15'
Dropping cluster 15/regress ...
### End 15 installcheck ###
   dh_strip_nondeterminism
   dh_compress
   dh_fixperms
   dh_missing
   dh_dwz
   dh_strip
   dh_makeshlibs
   dh_shlibdeps
   dh_installdeb
   dh_gencontrol
dpkg-gencontrol: warning: Depends field of package postgresql-13-base36: substitution variable ${shlibs:Depends} used, but is not defined
dpkg-gencontrol: warning: Depends field of package postgresql-10-base36: substitution variable ${shlibs:Depends} used, but is not defined
dpkg-gencontrol: warning: Depends field of package postgresql-14-base36: substitution variable ${shlibs:Depends} used, but is not defined
dpkg-gencontrol: warning: Depends field of package postgresql-11-base36: substitution variable ${shlibs:Depends} used, but is not defined
dpkg-gencontrol: warning: Depends field of package postgresql-15-base36: substitution variable ${shlibs:Depends} used, but is not defined
dpkg-gencontrol: warning: Depends field of package postgresql-12-base36: substitution variable ${shlibs:Depends} used, but is not defined
   dh_md5sums
   dh_builddeb
dpkg-deb: building package 'postgresql-10-base36' in '../postgresql-10-base36_0.0.1-1_amd64.deb'.
dpkg-deb: building package 'postgresql-13-base36' in '../postgresql-13-base36_0.0.1-1_amd64.deb'.
dpkg-deb: building package 'postgresql-11-base36' in '../postgresql-11-base36_0.0.1-1_amd64.deb'.
dpkg-deb: building package 'postgresql-14-base36' in '../postgresql-14-base36_0.0.1-1_amd64.deb'.
dpkg-deb: building package 'postgresql-12-base36' in '../postgresql-12-base36_0.0.1-1_amd64.deb'.
dpkg-deb: building package 'postgresql-15-base36' in '../postgresql-15-base36_0.0.1-1_amd64.deb'.
 dpkg-genbuildinfo --build=binary
 dpkg-genchanges --build=binary >../base36_0.0.1-1_amd64.changes
dpkg-genchanges: info: binary-only upload (no source code included)
 dpkg-source --after-build .
dpkg-buildpackage: info: binary-only upload (no source included)
```

After this the parent of the root directory would have deb of each version of the extension would be created.
``` bash
vagrant@ubuntu-focal:/vagrant/base36-0.0.1$ ls -la ..
drwxr-xr-x  1 vagrant vagrant   4096 Jul  1 20:21 base36-0.0.1
-rw-r--r--  1 vagrant vagrant  11760 Jul  1 18:11 base36_0.0.1-1_amd64.buildinfo
-rw-r--r--  1 vagrant vagrant   2910 Jul  1 18:11 base36_0.0.1-1_amd64.changes
-rw-r--r--  1 vagrant vagrant    820 Jul  1 12:10 base36_0.0.1.orig.tar.gz
-rw-r--r--  1 vagrant vagrant   2552 Jul  1 18:11 postgresql-10-base36_0.0.1-1_amd64.deb
-rw-r--r--  1 vagrant vagrant   2552 Jul  1 18:11 postgresql-11-base36_0.0.1-1_amd64.deb
-rw-r--r--  1 vagrant vagrant   2552 Jul  1 18:11 postgresql-12-base36_0.0.1-1_amd64.deb
-rw-r--r--  1 vagrant vagrant   2556 Jul  1 18:11 postgresql-13-base36_0.0.1-1_amd64.deb
-rw-r--r--  1 vagrant vagrant   2552 Jul  1 18:11 postgresql-14-base36_0.0.1-1_amd64.deb
-rw-r--r--  1 vagrant vagrant   2556 Jul  1 18:11 postgresql-15-base36_0.0.1-1_amd64.deb
```

### Gotchas:

- The name of the folder of the source code of the extension should be of the form <extension_name>\_<version>. 
- The debian/pgversions file should have a newline otherwise any pg_buildext would neither return any output or any error(status code 0).
- The `postgresql-all` package would be needed to build, install and test the extension on all the supported versions of PostgreSQL.


Fin.