USE spine;

DELETE FROM project_category;

INSERT INTO
    project_category (
        category_name,
        category_description
    )
VALUES (
        'Contingency-Based',
        'Contingency-based projects'
    ),
    (
        'FTE Based',
        'Full-Time Equivalent based projects'
    );

SELECT * FROM project_category;