package omp.telcoware.com;

public class HelloMessage {
	
	private String id;
	private String message;
	
	private String name;

	public String getName() {
		return name;
	}

	public String getId() {
		return id;
	}

//	public void setId(String id) {
//		this.id = id;
//	}

	public String getMessage() {
		return message;
	}



//	public void setMessage(String message) {
//		this.message = message;
//	}
	
	

//	public void setName(String name) {
//		this.name = name;
//	}
	
	@Override
	public String toString() {
		return "HelloMessage [id=" + id + ", message=" + message + ", name=" + name + "]";
	}
	
}
