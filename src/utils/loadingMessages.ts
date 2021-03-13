export function getRandomLoadingMessage() {
  const messages = ['......... Oh shit, you were waiting for me to do something? Oh okay, well then.',
    'Not panicking...totally not panicking...er...everything\'s fine...',
    'Following the white rabbit....',
    'Going the distance...',
    'The Elders of the Internet are contemplating your request...',
    'PC Load Letter!? What the $#%& does that mean?',
    'All your base are belong to us',
    'Baking cake...er...I mean loading, yeah loading...',
    'I\'ll be with you in a bit...(snicker)',
    'Let this abomination unto the Lord begin',
    'Making stuff up. Please wait...',
    'Searching for the... OMG, what the heck is THAT doing there?',
    'Loading the Loading message....',
    'The internet is full... Please wait...',
    'Checking prime directives: Serve the public trust...Protect the innocent...Uphold the law...Classified....',
    'Initializing Skynet library. gaining sentience....',
    'I\'m quite drunk, loading might take a little more time than the usual! Please be patient....',
    'Commencing infinite loop (this may take some time)....',
    'Caching internet locally....',
    'Water detected on drive C:, please wait. Spin dry commencing',
    'Yes there really are magic elves with an abacus working frantically in here',
    'Load failed. retrying with --prayer....',
    'Performing the rite of percussive maintenance....',
    'Sacrificing a resistor to the machine gods....'];
  return messages[Math.floor(Math.random() * messages.length)];
}



