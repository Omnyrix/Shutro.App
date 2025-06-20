#!/bin/bash

# === Variables ===
SOURCE_DIR=""
EXCLUDE_PATTERNS=()
OUTPUT_FILE="filestructure.txt"

# === Functions ===

usage() {
  echo "Usage: $0 [OPTIONS] SOURCE"
  echo "Generates a text-based file structure of SOURCE and saves it to '$OUTPUT_FILE'."
  echo ""
  echo "Options:"
  echo "  --exclude PATTERN     Exclude paths matching this pattern (e.g. 'logs', '.tmp')"
  echo "  -h, --help            Show this help message"
  exit 1
}

# Recursive function to generate structure
generate_tree() {
  local current_path="$1"
  local prefix="$2"

  local rel_path="${current_path#$SOURCE_DIR/}"
  [[ "$rel_path" == "$SOURCE_DIR" ]] && rel_path="."

  # Skip hidden dirs
  local base=$(basename "$current_path")
  if [[ "$base" == .* ]]; then
    return
  fi

  # Check exclude patterns
  for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$base" == $pattern ]]; then
      return
    fi
  done

  # Add current dir to output
  echo "${prefix}├── $rel_path" >> "$OUTPUT_FILE"

  local entries=()
  while IFS= read -r -d '' item; do
    entries+=("$item")
  done < <(find "$current_path" -mindepth 1 -maxdepth 1 -print0 2>/dev/null | sort -z)

  local count=${#entries[@]}
  local i=1

  for item in "${entries[@]}"; do
    local name=$(basename "$item")

    # Skip hidden items
    if [[ "$name" == .* ]]; then
      continue
    fi

    # Check exclude
    local should_exclude=false
    for pattern in "${EXCLUDE_PATTERNS[@]}"}; do
      if [[ "$name" == $pattern ]]; then
        should_exclude=true
        break
      fi
    done

    if $should_exclude; then
      continue
    fi

    if [[ -d "$item" ]]; then
      if [[ $i -eq $count ]]; then
        echo "${prefix}│   └── $name" >> "$OUTPUT_FILE"
        generate_tree "$item" "${prefix}    "
      else
        echo "${prefix}│   ├── $name" >> "$OUTPUT_FILE"
        generate_tree "$item" "${prefix}│   "
      fi
    else
      if [[ $i -eq $count ]]; then
        echo "${prefix}│   └── $name" >> "$OUTPUT_FILE"
      else
        echo "${prefix}│   ├── $name" >> "$OUTPUT_FILE"
      fi
    fi

    ((i++))
  done
}

# === Parse arguments ===
ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --exclude)
      if [[ -n "$2" ]]; then
        EXCLUDE_PATTERNS+=("$2")
        shift 2
      else
        echo "Error: --exclude requires a pattern"
        usage
      fi
      ;;
    -h|--help)
      usage
      ;;
    *)
      ARGS+=("$1")
      shift
      ;;
  esac
done

# === Validate source dir ===
if [[ ${#ARGS[@]} -ne 1 ]]; then
  usage
fi

SOURCE_DIR="$(realpath "${ARGS[0]}")"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: Source directory '$SOURCE_DIR' does not exist."
  exit 1
fi

# Remove existing output file
> "$OUTPUT_FILE"

# Start generating structure
echo "Generating file structure..." > /dev/stderr
echo "Directory structure for: $SOURCE_DIR" > "$OUTPUT_FILE"
echo "========================================" >> "$OUTPUT_FILE"

generate_tree "$SOURCE_DIR" ""

echo "✅ File structure saved to: $OUTPUT_FILE"