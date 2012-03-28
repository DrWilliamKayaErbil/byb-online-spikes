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

        self.mock_aiff_file('bob.aiff')
        obj = main.get_audio_object_for('bob.aiff')
        self.assertIsInstance(obj, main.aifc.Aifc_read)

    def mock_aiff_file(self, filename):
        aiff_file = main.aifc.open('/tmp/'+filename, 'w')
        self.write_data_to_audio_file(aiff_file)

    def mock_wave_file(self, filename):
        wav_file = main.wave.open('/tmp/'+filename, 'w')
        self.write_data_to_audio_file(wav_file)

    def write_data_to_audio_file(self, audio_obj):
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
        audio_obj.setparams((nchannels, sampwidth, framerate, nframes,
                    comptype, compname))
        # now write out the file ...
        for s in sine_list:
            # write the audio frames to file
            audio_obj.writeframes(main.struct.pack('h', int(s*amp/2)))
        audio_obj.close()

if __name__ == '__main__':
    unittest.main()
