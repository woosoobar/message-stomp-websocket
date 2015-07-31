package omp.telcoware.com;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

@Controller
public class OmpController {

	static final Logger logger = Logger.getLogger(OmpController.class);
	
	static long index  = 0;
	
	@Autowired
	private SimpMessagingTemplate brokerMessagingTemplate;
	
	@MessageMapping("/omp")
	@SendTo("/topic/greetings")
	public Message greeting(Message message) throws Exception {
		//Thread.sleep(3000);
		Message outMsg = new Message();
		outMsg.setMessage(message.getMessage());
		outMsg.setId(message.getId());
		outMsg.setTime(new Date());
		return outMsg;
	}
	
	@MessageMapping("/userhello")
	@SendToUser("/queue/greetings")
	public Message userGreeting(Message message) throws Exception {

		logger.info(message);
		
		Message outMsg = new Message();
		outMsg.setMessage(message.getMessage());
		outMsg.setId(message.getId());
		outMsg.setTime(new Date());
		return outMsg;
	}
	
	@Scheduled(fixedRate = 1000)
	public void scheduledRealtimeAlaram() throws Exception {

		Alarm alarm = new Alarm();
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		
		alarm.setTimestamp(dateFormat.format(date));
		//system: "HLRCS152A", upper: "STACK", lower: "IPSP", item: "HRG_3.20", grade: "MAJOR", time: "2015-06-26 11:28:18", log: "A1363 IPSP CONNECTION STATUS ALARM OCURRED"},
		alarm.setSystem("HLRCS152A");
		alarm.setUpper("STACK");
		alarm.setLower("IPSP");
		alarm.setItem(String.format("HRG_3.20-%d%n", index));
		alarm.setGrade(AlarmGrade.getRandomGrade());
		alarm.setLog("A1363 IPSP CONNECTION STATUS ALARM OCURRED");
		
		this.brokerMessagingTemplate.convertAndSend("/topic/realtimeAlarm", alarm);
	}
	
	@Scheduled(fixedRate = 1000)
	public void scheduledResourceMonitor() throws Exception {

		ResourceMonitor resourceMonitor = new ResourceMonitor();

		//DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
		Date date = new Date();
		
		resourceMonitor.setTimestamp(dateFormat.format(date));
		
		// random 으로 해달 값을 설정한다.
		Random generator = new Random();   
		
		int random = generator.nextInt(100);
		
		
		resourceMonitor.setCpuMax(50);
		resourceMonitor.setCpuAverage(random);
		
		random = generator.nextInt(100);
		resourceMonitor.setRamMax(80);
		resourceMonitor.setRamAverage(random);
		
		random = generator.nextInt(100);
		resourceMonitor.setDiskMax(60);
		resourceMonitor.setDiskAverage(random);
		
		this.brokerMessagingTemplate.convertAndSend("/topic/resourceMonitor", resourceMonitor);
	}

}
