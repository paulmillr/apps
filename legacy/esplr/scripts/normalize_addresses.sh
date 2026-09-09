#!/bin/bash

found_any=false
selected_chain_ids=()

# Parse parameters
while [[ $# -gt 0 ]]; do
  case "$1" in
    --chains)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        selected_chain_ids+=("$1")
        shift
      done
      ;;
    *)
      echo "!!!ERROR: Unknown parameter: $1"
      exit 1
      ;;
  esac
done

echo "Normalizing addresses for the next chains: ${selected_chain_ids[@]}"

contains() {
  local value="$1"
  shift
  for item in "$@"; do
    if [[ "$item" == "$value" ]]; then
      return 0
    fi
  done
  return 1
}

# Loop through both match types
for match_type in full_match partial_match; do
  # Check that folders with  match type exist
  if [[ ! -d "$match_type" ]]; then
    echo "! Warning: '$match_type' directory not found in '$REPO_DIR'. Skipping..."
    continue
  fi

  echo "Normalizing $match_type ..."
  found_any=true

  # Loop through each chain ID directory (e.g. 1/, 2/)
  for chain_id_dir in "$match_type"/*/; do
    chain_id=$(basename "$chain_id_dir")

    # If specific chains are provided, skip those not in the list
    if [[ ${#selected_chain_ids[@]} -gt 0 ]]; then
      contains "$chain_id" "${selected_chain_ids[@]}" || continue
    fi

    # Loop through each address folder
    for address_dir in "$chain_id_dir"*/; do
      # Get original and lowercase folder names
      orig_dir=$(basename "$address_dir")
      lower_dir=$(echo "$orig_dir" | tr '[:upper:]' '[:lower:]')

      # Only rename if names differ
      if [[ "$orig_dir" != "$lower_dir" ]]; then
        src="${chain_id_dir}${orig_dir}"
        dst="${chain_id_dir}${lower_dir}"

        # If destination already exists, warn and skip to avoid overwriting
        if [[ -e "$dst" ]]; then
          echo "! Skipping: $dst already exists (from $src)"
        else
          echo "x Renaming: $src -> $dst"
          mv "$src" "$dst"
        fi
      fi
    done
  done
done

# Show warning if neither folder was found
if [[ "$found_any" = false ]]; then
  echo "!!!ERROR:"
  echo "Cannot find directories 'partial_match' / 'full_match' in $pwd"
  echo "Ensure normalize_addresses.sh is located in proper directory"
fi
