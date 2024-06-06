from manim import *
from pyttsx3 import init
from pydub import AudioSegment

class IntroductionToAlgorithms2(Scene):
    def construct(self):
        # Set background color to black
        self.camera.background_color = BLACK

        # Title Page
        title = Text("Introduction to Algorithms", font_size=72, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Clear Title Page
        self.play(FadeOut(title))

        # Introduction Text
        intro_text = [
            "An algorithm is a step-by-step procedure to solve a problem.",
            "Example: Sorting Algorithm.",
            "Array: [4, 1, 9, 5, 2]"
        ]
        text_objs = [Text(text, font_size=36, color=WHITE) for text in intro_text]

        # Position each text below the previous one
        for i, text_obj in enumerate(text_objs):
            if i == 0:
                text_obj.to_edge(UP)
            else:
                text_obj.next_to(text_objs[i - 1], DOWN, buff=0.5)
            self.play(Write(text_obj))
            self.wait(1)

        # Clear Introduction Text
        self.play(*[FadeOut(text_obj) for text_obj in text_objs])

        # Bubble Sort Animation
        array_text = Text("Let us consider the following array", font_size=36, color=WHITE)
        array_text.to_edge(UP)
        self.play(Write(array_text))
        self.wait(1)

        # Display the array as the text is being written
        array = [4, 1, 9, 5, 2]
        self.show_array(array)
        self.wait(1)

        self.bubble_sort_animation(array)

    def show_array(self, array):
        self.nums = [Text(str(num), font_size=36, color=WHITE) for num in array]
        nums_group = VGroup(*self.nums).arrange(RIGHT, buff=0.5)
        nums_group.move_to(DOWN)
        self.play(FadeIn(nums_group))
        self.wait(1)

    def bubble_sort_animation(self, array):
        n = len(array)
        steps = ["Let us consider the following array: " + str(array)]
        for i in range(n):
            for j in range(0, n - i - 1):
                steps.append(f"Comparing {array[j]} and {array[j + 1]}")
                if array[j] > array[j + 1]:
                    # Swap in array
                    array[j], array[j + 1] = array[j + 1], array[j]
                    steps.append(f"Swapping {array[j]} and {array[j + 1]}")
                    # Highlight elements being compared
                    self.play(self.nums[j].animate.set_color(RED),
                              self.nums[j + 1].animate.set_color(RED))
                    self.wait(1)  # Slower animation
                    # Swap numbers
                    self.play(Swap(self.nums[j], self.nums[j + 1]))
                    self.nums[j], self.nums[j + 1] = self.nums[j + 1], self.nums[j]
                    self.wait(1)  # Slower animation
                    # Reset colors after swap
                    self.play(self.nums[j].animate.set_color(WHITE),
                              self.nums[j + 1].animate.set_color(WHITE))
                    self.wait(1)  # Slower animation
                else:
                    # If no swap, just highlight and wait
                    self.play(self.nums[j].animate.set_color(YELLOW),
                              self.nums[j + 1].animate.set_color(YELLOW))
                    self.wait(1)  # Slower animation
                    self.play(self.nums[j].animate.set_color(WHITE),
                              self.nums[j + 1].animate.set_color(WHITE))
                    self.wait(1)  # Slower animation

        self.create_audio(steps)

    def create_audio(self, steps):
        # Initialize the TTS engine
        engine = init()

        # Set the rate of speech (words per minute)
        engine.setProperty('rate', 150)

        # Introduction text for TTS
        intro_text = """
        Introduction to Algorithms.
        An algorithm is a step-by-step procedure to solve a problem.
        Example: Sorting Algorithm.
        Array: [4, 1, 9, 5, 2].
        
        """

        # Combine steps into a single string for narration
        narration = intro_text + "\n" + "\n".join(steps)

        # Convert combined text to speech and save as audio file
        engine.save_to_file(narration, 'intro_to_algorithms_steps_with_intro.mp3')

        # Wait for the speech engine to finish speaking
        engine.runAndWait()

if __name__ == "__main__":
    config.pixel_height = 1080
    config.pixel_width = 1920
    config.frame_height = 8.0
    config.frame_width = 14.0
    scene = IntroductionToAlgorithms2()
    scene.render()
