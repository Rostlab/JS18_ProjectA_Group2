#! /bin/bash
cd nlp_engine
if command -v python3 &>/dev/null; then
  python3 -m rasa_nlu.server -c sample_configs/config_spacy.json
else
  python -m rasa_nlu.server -c sample_configs/config_spacy.json
fi
