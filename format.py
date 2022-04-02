import pandas as pd


def format_data():
    courses = pd.read_csv("data_courses.csv")

    # Add index

    classrooms = pd.read_csv("data_classrooms.csv")
    # classrooms = list((df['meet_bdg'] + df['meet_rm']).unique())

    classrooms.insert(0, 'id', range(len(classrooms)))

    vs = list(classrooms['value'])

    course_vs = (courses['meet_bdg'] + '|' + courses['meet_rm'])
    courses.insert(0, 'classroom_id', course_vs.apply(lambda v: vs.index(v)))

    courses.to_csv("data_formatted_courses.csv", mode='w', index=False,
                   header=True)
    classrooms.to_csv("data_formatted_classrooms.csv", mode='w', index=False,
                      header=True)


if __name__ == "__main__":
    format_data()
