import datetime
import collections

class RuleEngine:
    def __init__(self):
        # Store the last 10 frames of violations to smooth out flickering
        self.recent_violations = collections.deque(maxlen=10)
        
        # Mock schedule defining expected attire
        self.schedule = {
            0: "Uniform", # Monday
            1: "Uniform", # Tuesday
            2: "Civilian", # Wednesday
            3: "Uniform", # Thursday
            4: "Civilian", # Friday
            5: "Civilian", # Saturday
            6: "Civilian"  # Sunday
        }
        
    def get_current_day(self):
        return datetime.datetime.now().weekday()
        
    def get_rules(self):
        day_index = self.get_current_day()
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return {
            "current_day": days[day_index],
            "expected_attire": self.schedule.get(day_index, "Civilian")
        }

    def evaluate(self, detections):
        """
        Evaluate detections against current rules using a stabilized history buffer.
        """
        day_index = self.get_current_day()
        expected = self.schedule.get(day_index, "Civilian")
        
        # 1. Collect all labels detected in the current frame
        current_frame_labels = [det["label"] for det in detections]
        self.recent_violations.append(current_frame_labels) # Stores labels now, despite the variable name
        
        # 2. Count occurrences of each label over the last 10 frames
        all_recent_labels = [label for frame_labels in self.recent_violations for label in frame_labels]
        counts = collections.Counter(all_recent_labels)
        
        # 3. A label is considered "stable" if it appeared in at least 3 of the last 10 frames
        stable_labels = [label for label, count in counts.items() if count >= 3]
        
        status = "✅ Compliant"
        flagged_items = []
        
        # Universal non-compliant items
        non_compliant_items = [
            "unprescribed_shorts", "blouse_deepneckline", "cropped_top", 
            "ripped_jeans", "sleeveless_top", "leggings", "mini_skirt", "slippers"
        ]
        
        # Rule Evaluation
        if expected == "Uniform":
            # Must have uniform top, bottom, and closed shoes
            has_top = "uniform_top" in stable_labels
            has_bottom = "uniform_bottom" in stable_labels
            has_shoes = "closed_shoes" in stable_labels
            
            # If they are missing any required item, but we actually detect something stable, we flag it.
            if stable_labels: 
                if not (has_top and has_bottom and has_shoes):
                    status = "⚠️ Violation Detected"
                    missing = []
                    if not has_top: missing.append("Uniform Top")
                    if not has_bottom: missing.append("Uniform Bottom")
                    if not has_shoes: missing.append("Closed Shoes")
                    flagged_items.append(f"Missing: {', '.join(missing)}")
                    
                # Check for civilian or non-compliant items on Uniform days
                for item in stable_labels:
                    if item in non_compliant_items or item in ["tshirt", "jeans", "business_shorts"]:
                        status = "⚠️ Violation Detected"
                        flagged_items.append(f"Not allowed on Uniform Day: {item.replace('_', ' ').title()}")
                        
        else: # Civilian
            # Just check against the strict non-compliant list
            for item in stable_labels:
                if item in non_compliant_items:
                    status = "⚠️ Violation Detected"
                    flagged_items.append(f"Inappropriate attire: {item.replace('_', ' ').title()}")
                    
        return {
            "status": status,
            "flagged_items": list(set(flagged_items))
        }
