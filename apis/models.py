from apis import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    profession = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.email}', '{self.name}')"


class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(1000), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    user_email = db.Column(db.String(120))

    def __repr__(self):
        return f"Summary('{self.title}', '{self.user_email}')"


class IRQuery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(1000), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(1000), nullable=False)
    link = db.Column(db.String(2000), nullable=False)
    user_email = db.Column(db.String(120))

    def __repr__(self):
        return f"IRQuery('{self.title}', '{self.user_email}')"


class Qna(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    paragraph = db.Column(db.Text, nullable=False)
    user_email = db.Column(db.String(120))

    def __repr__(self):
        return f"Qna('{self.question}, '{self.user_email}')"
