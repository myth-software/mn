#!/bin/bash

echo "making directories..."
DIRECTORIES="src/factories/**/files/**"
for dir in $DIRECTORIES
do
  mkdir -p ../../dist/packages/schematics/"$dir"
done

echo "making files..."
FILES="src/factories/**/files/**/*"
for f in $FILES
do
  tr -d '\n' < "$f" > ../../dist/packages/schematics/"$f"
  sed -i '' 's/  */ /g' ../../dist/packages/schematics/"$f"
done

cp src/collection.json ../../dist/packages/schematics/collection.json