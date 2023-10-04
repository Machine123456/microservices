#!/bin/bash

github_account="Machine123456"
repo_name="microservices"
directoryPath="."

repo_url="https://github.com/$github_account/$repo_name.git"

cd "$directoryPath" || exit 1
git clone "$repo_url" || exit 1

cd "./$repo_name" || exit 1

branches=( $(git branch -a | tail -n +3 | awk -F'/' '{print $NF}') )

for branch in "${branches[@]}"; do
   if [ ! -z "$branch" ]; then
        mkdir -p "$branch"
        git clone -b "$branch" --single-branch "$repo_url" "$branch"
   fi
done

items=( $(ls -A) )

for item in "${items[@]}"; do
   if [[ ! " ${branches[@]} " =~ " ${item} " ]]; then
       if [ -d "$item" ]; then
            rm -rf "$item"
       else
          rm -f "$item"
       fi
   fi
done
