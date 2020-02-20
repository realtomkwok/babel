import azure.cognitiveservices.speech as speechsdk

speech_key, service_region = "e2548ad8116e48bd931e91eb94b3b45d", "westus"

def translate_speech_to_text(fromLanguage, toLanguage):

    # Creates an instance of a speech translation config with specified subscription key and service region.
    # Replace with your own subscription key and service region (e.g., "westus").
    translation_config = speechsdk.translation.SpeechTranslationConfig(subscription=speech_key, region=service_region)

    # Sets source and target languages.
    # Replace with the languages of your choice, from list found here: https://aka.ms/speech/sttt-languages
    translation_config.speech_recognition_language = fromLanguage
    translation_config.add_target_language(toLanguage)

    # Creates a translation recognizer using and audio file as input.
    recognizer = speechsdk.translation.TranslationRecognizer(translation_config=translation_config)
    
    result = recognizer.recognize_once()

    # Check the result
    if result.reason == speechsdk.ResultReason.TranslatedSpeech:
        return result.text, result.translations[toLanguage]
    elif result.reason == speechsdk.ResultReason.RecognizedSpeech:
        error_msg = 'Text could not be translated'
        return result.text, error_msg
    elif result.reason == speechsdk.ResultReason.NoMatch:
        error_msg = "NOMATCH: Speech could not be recognized: {}".format(result.no_match_details)
        return error_msg
    elif result.reason == speechsdk.ResultReason.Canceled:
        error_msg = "CANCELED: Reason={}".format(result.cancellation_details.reason)
        if result.cancellation_details.reason == speechsdk.CancellationReason.Error:
           error_msg = "CANCELED: ErrorDetails={}".format(result.cancellation_details.error_details)
        return error_msg