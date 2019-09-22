import sys
from youtube_transcript_api import YouTubeTranscriptApi
import sys
video_id = sys.argv[1]

print(YouTubeTranscriptApi.get_transcript(video_id))
