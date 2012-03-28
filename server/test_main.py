import unittest
import main
import math

class AnalyzeServerTestCase(unittest.TestCase):

    def setUp(self):
        main.app.config['TESTING'] = True
        self.app = main.app.test_client()

    def test_file_endings(self):
        self.assertTrue(main.allowed_file('bob.wave'))
        self.assertTrue(main.allowed_file('bob.wav'))
        self.assertTrue(main.allowed_file('bob.aif'))
        self.assertTrue(main.allowed_file('bob.aiff'))
        self.assertFalse(main.allowed_file('derp.jpg'))
        self.assertFalse(main.allowed_file('.wav'))
        self.assertFalse(main.allowed_file('derp.mp3'))

    def test_open_proper_file_type(self):
        "make sure we're getting an instance of the right kind of class"
        self.mock_wave_file('bob.wav')
        obj = main.get_audio_object_for('bob.wav')
        self.assertIsInstance(obj, main.wave.Wave_read)

    def mock_wave_file(self, filename):
        wav_file = main.wave.open('/tmp/'+filename, 'w')

        frate = 44100.0 # framerate as a float
        amp = 8000.0 # multiplier for amplitude
        freq = 440
        # make a sine list ...
        sine_list = []
        for x in range(44100):
            sine_list.append(math.sin(2*math.pi*freq*(x/frate)))
        nchannels = 1
        sampwidth = 2
        framerate = int(frate)
        nframes = 44100
        comptype = "NONE"
        compname = "not compressed"
        # set all the parameters at once
        wav_file.setparams((nchannels, sampwidth, framerate, nframes,
                    comptype, compname))
        # now write out the file ...
        print( "may take a moment ..." )
        for s in sine_list:
            # write the audio frames to file
            wav_file.writeframes(main.struct.pack('h', int(s*amp/2)))
        wav_file.close()

if __name__ == '__main__':
    unittest.main()
